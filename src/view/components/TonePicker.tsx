import { Card, CardBody, CardHeader, Divider, Slider } from "@nextui-org/react";
import chroma from "chroma-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextSelection, useModelStore } from "../../model/Model";
import { TextToneChanger } from "../../model/tools/promptTools/TextToneChanger";
import { useUndoModelStore } from "../../model/UndoModel";
import { useStudyStore } from "../../study/StudyModel";

interface AutoWidthInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const AutoWidthInput: React.FC<AutoWidthInputProps> = ({ value, onChange, className = "" }) => {
  const [inputValue, setInputValue] = useState(value);
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Обновляем ширину при монтировании и изменении значения
  const updateWidth = () => {
    if (spanRef.current && inputRef.current) {
      const width = Math.max(80, spanRef.current.offsetWidth + 24);
      inputRef.current.style.width = `${width}px`;
    }
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    updateWidth();
    // Запускаем обновление с небольшой задержкой, чтобы DOM успел обновиться
    const timeoutId = setTimeout(updateWidth, 50);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="relative" style={{ display: 'inline-block', textAlign: 'left' }}>
      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre px-2 py-1 text-xs"
        style={{ minWidth: '80px', fontWeight: 500 }}
      >
        {inputValue || 'placeholder'}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={`rounded-lg border border-[#E8E8E5] bg-white py-1 px-2 text-xs ${className}`}
        style={{ 
          width: '80px',
          textAlign: 'left',
          height: '32px',
          minWidth: '80px',
          fontWeight: 500
        }}
      />
    </div>
  );
};

export function TonePicker() {
  const tone = useModelStore(state => state.tone);
  const setTone = useModelStore(state => state.setTone);

  const wheelRef = React.createRef<HTMLDivElement>();
  const wheelSize = 200;
  const nToneValues = 10;

  const selectedTexts = useModelStore(state => state.selectedTexts);
  const [isSelectionDifferent, setIsSelectionDifferent] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const toneChanger = useMemo(() => {
    if (selectedTexts.length === 1) {
      // TODO: The intiial values should be obtained automaitcally with a prompt so that it makes sense
      const initialTone = JSON.parse(JSON.stringify(useModelStore.getState().tone));
      // Reset to all 5s
      for (let i = 0; i < initialTone.length; i++) {
        initialTone[i].value = 5;
      }
      return new TextToneChanger(selectedTexts[0].text, initialTone);
    }
    return null;
  }, [isSelectionDifferent]);

  useEffect(() => {
    if (selectedTexts.length === 1 && (!toneChanger || !toneChanger.isValueCached(selectedTexts[0].text))) {
      setIsSelectionDifferent(!isSelectionDifferent);
    }
  }, [selectedTexts]);


  function getColorFromWheelPosition(x: number, y: number, width: number, height: number) {
    const dx = x / width - 0.5;
    const dy = y / height - 0.5;
    const hue = Math.atan2(-dy, -dx) * (360 / (Math.PI * 2))
    const dist = Math.sqrt(dx * dx + dy * dy);

    const s = (Math.min(dist, 0.5) / 0.5);

    const rgb = dist > 0.5 ? [255, 255, 255] : chroma.hsv(hue, s, 1).rgb();

    return [Math.round(rgb[0] / 255 * nToneValues) / nToneValues * 255, Math.round(rgb[1] / 255 * nToneValues) / nToneValues * 255, Math.round(rgb[2] / 255 * nToneValues) / nToneValues * 255];
  }

  function getWheelPositionFromColor(r: number, g: number, b: number, width: number, height: number) {
    const hsv = chroma(r / 255, g / 255, b / 255).hsv();
    const angle = hsv[0] / 360 * 2 * Math.PI;
    const dist = hsv[1];

    const x = -Math.cos(angle) * dist * 0.5 + 0.5;
    const y = -Math.sin(angle) * dist * 0.5 + 0.5;


    return [x * width, y * height];
  }

  function changeSelectedTextTone() {
    if (selectedTexts.length === 1 && toneChanger) {
      toneChanger.cachedExecute(tone).then(result => {
        const newSelection: TextSelection[] = [];
        for (const selectedText of selectedTexts) {
          newSelection.push({ ...selectedText, text: result, isLoading: false });
        }
        useUndoModelStore.getState().storeUndoState();
        useModelStore.getState().animateNextChanges();
        useModelStore.getState().setSelectedTexts(newSelection);
      });
      // Show that the selection is loading
      const newSelection: TextSelection[] = [];
      for (const selectedText of useModelStore.getState().selectedTexts) {
        newSelection.push({ ...selectedText, isLoading: true });
      }
      useModelStore.getState().setSelectedTexts(newSelection);
    }
  }


  const currentWheelPosition = getWheelPositionFromColor(tone[0].value / nToneValues * 255, tone[1].value / nToneValues * 255, tone[2].value / nToneValues * 255, wheelSize, wheelSize);
  const currentWheelColor = `rgb(${tone[0].value / nToneValues * 255}, ${tone[1].value / nToneValues * 255}, ${tone[2].value / nToneValues * 255})`;

  // Calculate guides to help user decide in which direction to move the cursor
  const guides : any[] = [];
  tone.forEach((toneSpace, i) => {
    const direction = toneSpace.value > 5 ? -1 : 1; // Go in the direction that has the most space available
    // Calculate the position of the cursor if we were to go in that direction
    const guideValue = Math.min(toneSpace.value + direction * 3, nToneValues);
    const guidePosition = getWheelPositionFromColor(
      (i === 0 ? guideValue : tone[0].value) / nToneValues * 255,
      (i === 1 ? guideValue : tone[1].value) / nToneValues * 255, 
      (i === 2 ? guideValue : tone[2].value) / nToneValues * 255,
       wheelSize, wheelSize);
    
    // Make sure the guide does not go out of bounds
    const distance = Math.sqrt((guidePosition[0] - currentWheelPosition[0]) ** 2 + (guidePosition[1] - currentWheelPosition[1]) ** 2);
    if (distance < wheelSize / 2) {
      const isLeftSide = guidePosition[0] < currentWheelPosition[0];
      const isBottomSide = guidePosition[1] > currentWheelPosition[1];

      guides.push({name: direction === -1 ? toneSpace.lowAdjective : toneSpace.highAdjective, position: guidePosition, textAnchor: isLeftSide ? "end" : "start", dominantBaseline: isBottomSide ? "hanging" : "auto"});
    }
  });

  useEffect(() => {
    const onMouseUp = (e : MouseEvent) => {
      if (e.button === 0 && isDragging) {
        setIsDragging(false);
        changeSelectedTextTone();
        useStudyStore.getState().logEvent("TONE_CHANGED", {source: 'wheel', tone: useModelStore.getState().tone});
      }
    }
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
    }
  });


  const updateToneFromMousePosition = (e: React.MouseEvent) => {
    if (wheelRef.current) {
      const width = wheelRef.current?.clientWidth;
      const height = wheelRef.current?.clientHeight;
      const rgb = getColorFromWheelPosition(e.clientX - wheelRef.current?.getBoundingClientRect().left, e.clientY - wheelRef.current?.getBoundingClientRect().top, width, height)
      tone[0].value = rgb[0] / 255 * nToneValues;
      tone[1].value = rgb[1] / 255 * nToneValues;
      tone[2].value = rgb[2] / 255 * nToneValues;

      setTone([...tone]);
    }
  }


  return (
    <Card style={{ 
      width: 'auto', 
      minWidth: 200, 
      maxWidth: 320, 
      minHeight: 451, 
      boxShadow: '0px 0px 20px 0px rgba(203, 203, 203, 0.20)', 
      border: '1px solid #E8E8E5', 
      borderRadius: '16px',
      margin: '0'
    }}>
      <CardHeader>
        <span style={{ fontWeight: 500 }}>Tone picker</span>
      </CardHeader>
      <Divider />
      <CardBody style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 16, width: '100%' }}>
          <div className={"group"} ref={wheelRef} style={{ position: 'relative', width: wheelSize, height: wheelSize }}
          
          onMouseDown={(e) => {
              if (wheelRef.current && e.button === 0) {
                setIsDragging(true);
                updateToneFromMousePosition(e);
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }

          onMouseMove={(e) => {
              if (isDragging) {
                updateToneFromMousePosition(e);
              }
            }
          }
          >
            <div style={{ position: 'absolute', borderRadius: '50%', transform: 'rotateZ(270deg)', inset: 0, background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}></div>
            <div style={{ position: 'absolute', borderRadius: '50%', transform: 'rotateZ(270deg)', inset: 0, background: 'radial-gradient(circle closest-side, rgb(255, 255, 255), transparent)' }}></div>
            <div className={"group-[:not(:hover)]:invisible"} style={{ position: 'absolute', left: 0, top: 0, width: wheelSize, height: wheelSize, pointerEvents: 'none', userSelect: 'none' }}>
              <svg width={wheelSize} height={wheelSize} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="3.5" refY="1.5" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,3 L4.5,1.5 z" />
                  </marker>
                </defs>
                {
                  guides.map((guide, i) => {
                    return <g  key={i}>
                      <line markerEnd="url(#arrow)"x1={currentWheelPosition[0]} y1={currentWheelPosition[1]} x2={guide.position[0]} y2={guide.position[1]} stroke="black" strokeWidth="2" />
                      <text  x={guide.position[0]} y={guide.position[1]} textAnchor={guide.textAnchor} dominantBaseline={guide.dominantBaseline} fontSize="10" fill="black">{guide.name}</text>
                    </g> 
                  })
                }
              </svg>
            </div>
            {(!Number.isNaN(currentWheelPosition[0]) && !Number.isNaN(currentWheelPosition[1])) &&
              <div style={{ 
                position: 'absolute', 
                left: currentWheelPosition[0] - 8, 
                top: currentWheelPosition[1] - 8, 
                width: 16, 
                height: 16, 
                border: '3px solid white', 
                borderRadius: '50%', 
                background: currentWheelColor,
                boxShadow: 'none'
              }}></div>
            }
          </div>
          {tone.map((t, i) => <div key={i} style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
              <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-start', overflow: 'hidden', fontWeight: 500 }}>
                <AutoWidthInput 
                  value={t.lowAdjective}
                  className="h-8"
                  onChange={(value) => {
                    tone[i].lowAdjective = value;
                useStudyStore.getState().logEvent("TONE_NAMES_CHANGED", {tone: tone});
                setTone([...tone]);
                  }}
                />
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', overflow: 'hidden', fontWeight: 500 }}>
                <AutoWidthInput 
                  value={t.highAdjective}
                  className="h-8"
                  onChange={(value) => {
                    tone[i].highAdjective = value;
                useStudyStore.getState().logEvent("TONE_NAMES_CHANGED", {tone: tone});
                setTone([...tone]);
                  }}
                />
              </div>
            </div>
            <Slider aria-label={t.highAdjective} showSteps color={['danger', 'success', 'primary'][i] as any} size='md' minValue={0} maxValue={10} step={1} value={t.value} /*label={t.lowAdjective} */
              onChange={(e) => { tone[i].value = e as number; setTone([...tone]) }}
              onChangeEnd={(_) => {
                useStudyStore.getState().logEvent("TONE_CHANGED", {source: 'slider', tone: tone});
                changeSelectedTextTone();
              }
              }
              style={{ width: '100%', marginTop: 8 }}
              classNames={{
                track: `border-none ${['bg-gradient-to-r from-red-50 to-red-600', 'bg-gradient-to-r from-green-50 to-green-600', 'bg-gradient-to-r from-blue-50 to-blue-600'][i]}`,
                filler: "opacity-0",
                thumb: ""
              }}
            ></Slider>
          </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
