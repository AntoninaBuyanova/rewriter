import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@nextui-org/react";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { tools, useModelStore } from "../../model/Model";
import { ToolbarTool } from "../../model/tools/toolbarTools/ToolbarTool";
import { useUndoModelStore } from "../../model/UndoModel";
import { BackIcon } from "./icons/CustomIcons";

export function ToolbarButton(props: {tool: ToolbarTool, toolVariants: ToolbarTool[], isTabletMode?: boolean}) {
  const setSelectedTool = useModelStore(state => state.setSelectedTool);
  const selectedToolStr = useModelStore(state => state.selectedTool);
  const selectedTool = tools[selectedToolStr];

  const isSelected = selectedTool === props.tool;

  const size = props.isTabletMode ? 44 : 32;

  return (<div style={{
    display: 'flex', 
    flexDirection: props.isTabletMode ? 'column' : 'row', 
    marginBottom: props.isTabletMode ? 0 : 8,
    marginRight: props.isTabletMode ? 16 : 0,
    alignItems: 'center'
  }}>
    <div style={{width: 10, display: props.isTabletMode ? 'none' : 'block'}}>
    {props.toolVariants.length > 1 && !props.isTabletMode && <Dropdown>
    <DropdownTrigger>
      <Button isIconOnly size={"sm"} variant={"light"} style={{width: 10, minWidth: 10, height: size, minHeight: size}}>
        <IoIosArrowDown style={{width: 8}} />
      </Button>
    </DropdownTrigger>
    <DropdownMenu variant="flat">
      {props.toolVariants.map((tool) => {
        return <DropdownItem textValue={tool.name} key={tool.name} onClick={() => {
          // Change the order of the tools to place this tool as the first one
          const toolOrder = useModelStore.getState().toolsOrderInToolbar;
          const idx = toolOrder.findIndex((toolNames) => toolNames.includes(tool.name));
          const newToolOrder = [...toolOrder];
          newToolOrder[idx] = [tool.name, ...newToolOrder[idx].filter((toolName) => toolName !== tool.name)];
          useModelStore.getState().setToolOrderInToolbar(newToolOrder);
          useModelStore.getState().setSelectedTool(tool.name);
        }}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <div style={{width: 15}}>{props.tool.name === tool.name && <IoMdCheckmark/>}</div>
            <div style={{width: 15}}>{tool.getIcon()}</div>
            <span>{tool.name}</span>
          </div>
          </DropdownItem>
      })}
    </DropdownMenu>
  </Dropdown>}
    </div>
      <Tooltip showArrow delay={0} closeDelay={0} content={<span>
      {props.tool.name}
    </span>} placement={props.isTabletMode ? "top" : "right"} offset={0}>
        <Button 
    isIconOnly
    size={props.isTabletMode ? "md" : "sm"}
    variant={"light"}
    style={{
      position: 'relative', 
      width: size, 
      height: size, 
      minWidth: size, 
      minHeight: size, 
      fontSize: props.isTabletMode ? 22 : 18, 
      color: isSelected ? "black" : '#71717B', 
      background: isSelected ? '#F2F2ED' : undefined,
      padding: props.isTabletMode ? '0' : undefined
    }}
    onClick={() => {
      setSelectedTool(props.tool.name);
    }}>
        {props.tool.getIcon()}
      </Button>
    </Tooltip>
  </div>)
}



export function Toolbar() {
  const undoStack = useUndoModelStore(state => state.undoStack);
  const redoStack = useUndoModelStore(state => state.redoStack);
  const toolsOrderInToolbar = useModelStore(state => state.toolsOrderInToolbar);
  const isTabletOrMobile = useMediaQuery('(max-width: 1024px)');

  const toolButtons = toolsOrderInToolbar.map((toolNames) => {
    const tool = tools[toolNames[0]];
    const toolVariants = [...toolNames].sort().map((toolName) => tools[toolName]);

    return <ToolbarButton 
      key={tool.name} 
      tool={tool} 
      toolVariants={toolVariants}
      isTabletMode={isTabletOrMobile}
    />
  });

  return (
    <div style={{ 
      position: 'fixed',
      ...(isTabletOrMobile ? {
        // Стили для планшетов и мобильных устройств
        bottom: 0,
        left: 0,
        right: 0,
        height: 'auto',
        padding: '16px',
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center', 
        background: 'white',
        borderTop: '1px solid #E8E8E5',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        zIndex: 100
      } : {
        // Стили для десктопа
        padding: '16px 16px',
        paddingTop: '24px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        background: 'white',
        borderRight: '1px solid #E8E8E5',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 50
      })
    }}>
      <div style={{
        display: 'flex',
        flexDirection: isTabletOrMobile ? 'row' : 'column',
        alignItems: 'center'
      }}>
          {toolButtons}
      </div>

      {!isTabletOrMobile && <Divider style={{marginBottom: 5, width: '100%'}} />}
      
      <div style={{
        display: 'flex',
        flexDirection: isTabletOrMobile ? 'row' : 'column',
        marginLeft: isTabletOrMobile ? 12 : 0
      }}>
        <Tooltip showArrow delay={0} closeDelay={0} content={"Undo"} placement={isTabletOrMobile ? "top" : "right"} offset={0}>
          <Button 
            isDisabled={undoStack.length === 0} 
            style={{color: '#71717a', fontSize: isTabletOrMobile ? 20 : 16}} 
            isIconOnly 
            size={isTabletOrMobile ? "md" : "sm"} 
            variant={"light"} 
            onClick={() => useUndoModelStore.getState().undo()}
          >
            <BackIcon size={isTabletOrMobile ? 24 : 20} color="#71717a" />
          </Button>
          </Tooltip>
        <Tooltip showArrow delay={0} closeDelay={0} content={"Redo"} placement={isTabletOrMobile ? "top" : "right"} offset={0}>
          <Button 
            isDisabled={redoStack.length === 0} 
            style={{color: '#71717a', fontSize: isTabletOrMobile ? 20 : 16, marginLeft: isTabletOrMobile ? 12 : 0}} 
            isIconOnly 
            size={isTabletOrMobile ? "md" : "sm"} 
            variant={"light"} 
            onClick={() => useUndoModelStore.getState().redo()}
          >
            <div style={{transform: 'scaleX(-1)'}}>
              <BackIcon size={isTabletOrMobile ? 24 : 20} color="#71717a" />
            </div>
          </Button>
          </Tooltip>
      </div>
        </div>
  )
}
