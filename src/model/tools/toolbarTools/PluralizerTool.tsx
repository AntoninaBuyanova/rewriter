import React from "react";
import { TextPluralizer, TextPluralizerType } from "../promptTools/TextPluralizer";
import { LocalWithGlobalImpactTool } from "./LocalWithGlobalImpactTool";
import { PluralizerIcon, SingularizerIcon } from "../../../view/components/icons/CustomIcons";

export class PluralizerTool extends LocalWithGlobalImpactTool {
    constructor() {
        super(PluralizerTool.getToolName());
    }

    getIcon() : React.ReactElement {
        return <PluralizerIcon />;
    }

    getIconHotspot(): { x: number; y: number; } {
        return { x: 8, y: 8 };
    }

    static getToolName() : string {
        return "Pluralizer";
    }

    executeLocalWithGlobalImpactModification(startText: string, text: string, endText: string): Promise<string> {
        return new TextPluralizer({start: startText, text: text, end: endText}).execute(TextPluralizerType.PLURALIZE);
    }
}

export class SingularizerTool extends LocalWithGlobalImpactTool {
    constructor() {
        super(SingularizerTool.getToolName());
    }

    getMarksClassname() : string {
        return "genericSelection" // Marks will use this class
    }

    getIcon() : React.ReactElement {
        return <SingularizerIcon />;
    }

    getIconHotspot(): { x: number; y: number; } {
        return { x: 8, y: 8 };
    }

    static getToolName() : string {
        return "Singularizer";
    }

    executeLocalWithGlobalImpactModification(startText: string, text: string, endText: string): Promise<string> {
        return new TextPluralizer({start: startText, text: text, end: endText}).execute(TextPluralizerType.SINGULARIZE);
    }
}