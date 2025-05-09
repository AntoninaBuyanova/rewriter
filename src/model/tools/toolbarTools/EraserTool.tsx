import React from "react";
import { TextEraser } from "../promptTools/TextEraser";
import { LocalWithGlobalImpactTool } from "./LocalWithGlobalImpactTool";
import { EraserIcon } from "../../../view/components/icons/CustomIcons";

export class EraserTool extends LocalWithGlobalImpactTool {
    constructor() {
        super(EraserTool.getToolName());
    }

    getMarksClassname() : string {
        return "genericSelection" // Marks will use this class
    }

    getIcon() : React.ReactElement {
        return <EraserIcon />;
    }

    getIconHotspot(): { x: number; y: number; } {
        return { x: 8, y: 14 };
    }

    static getToolName() : string {
        return "Erase";
    }

    executeLocalWithGlobalImpactModification(startText: string, text: string, endText: string): Promise<string> {
        return new TextEraser({start: startText, text: text, end: endText}).execute();
    }
}