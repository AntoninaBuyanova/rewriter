import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import React, { useState } from 'react';
import { BiSolidLayerPlus } from 'react-icons/bi';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { LayerManager } from './LayerManager';
import { TonePicker } from './TonePicker';
import { LayersIcon } from './icons/CustomIcons';

interface TopBarProps {
  disableTonePicker?: boolean;
  disableLayers?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ disableTonePicker, disableLayers }) => {
  const [isTonePickerOpen, setIsTonePickerOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const isTabletOrMobile = useMediaQuery('(max-width: 1024px)');

  // Закрыть другой попап при открытии одного из них
  const handleTonePickerOpen = (isOpen: boolean) => {
    setIsTonePickerOpen(isOpen);
    if (isOpen) setIsLayersOpen(false);
  };

  const handleLayersOpen = (isOpen: boolean) => {
    setIsLayersOpen(isOpen);
    if (isOpen) setIsTonePickerOpen(false);
  };

  // Не отображаем TopBar на десктопе
  if (!isTabletOrMobile) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'auto',
      background: '#FFFFFF',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '12px 16px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      gap: 8
    }}>
      {!disableTonePicker && (
        <Popover 
          isOpen={isTonePickerOpen} 
          onOpenChange={handleTonePickerOpen}
          placement="bottom"
          offset={15}
          classNames={{
            content: "p-0 border-0 shadow-md"
          }}
          backdrop="opaque"
        >
          <PopoverTrigger>
            <Button 
              size="md" 
              variant="flat" 
              style={{ 
                borderRadius: 8, 
                background: 'transparent', 
                border: '1px solid #E8E8E5',
                color: '#000',
                padding: '8px 16px',
                height: 'auto',
                fontFamily: 'AeonikPro, sans-serif',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: 140
              }}
            >
              <span style={{ fontWeight: 500 }}>Tone picker</span>
              <div style={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                background: 'rgb(148, 119, 192)', 
                marginLeft: 8 
              }}></div>
            </Button>
          </PopoverTrigger>
          <PopoverContent style={{ maxWidth: '90vw', width: 'auto', overflow: 'visible' }}>
            <TonePicker />
          </PopoverContent>
        </Popover>
      )}

      {!disableLayers && (
        <Popover 
          isOpen={isLayersOpen} 
          onOpenChange={handleLayersOpen}
          placement="bottom"
          offset={15}
          classNames={{
            content: "p-0 border-0 shadow-md"
          }}
          backdrop="opaque"
        >
          <PopoverTrigger>
            <Button 
              isIconOnly 
              size="md" 
              variant="flat" 
              style={{ 
                borderRadius: 8, 
                background: 'transparent', 
                border: '1px solid #E8E8E5',
                color: '#000',
                width: 40,
                height: 40
              }}
            >
              <LayersIcon size={24} />
            </Button>
          </PopoverTrigger>
          <PopoverContent style={{ maxWidth: '90vw', width: 'auto', overflow: 'visible' }}>
            <LayerManager />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}; 