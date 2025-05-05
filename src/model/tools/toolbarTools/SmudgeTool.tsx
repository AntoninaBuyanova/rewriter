import { ToolTextSelectionEvent, ToolbarTool } from "./ToolbarTool";
import React from "react";
import { TextSelection, useModelStore } from "../../Model";
import { TextSmudger } from "../promptTools/TextSmudger";
import { useUndoModelStore } from "../../UndoModel";
import { SmudgeIcon } from "../../../view/components/icons/CustomIcons";

export class SmudgeTool extends ToolbarTool {
    constructor() {
        super(SmudgeTool.getToolName());
    }

    getMarksClassname() : string {
        return "smudge" // Marks will use this class
    }

    getIcon() : React.ReactElement {
        return <SmudgeIcon />
    }

    getIconHotspot(): { x: number; y: number; } {
        return { x: 6, y: 0 };
    }

    isSelectionOpaque(): boolean {
        return true;
    }

    onTextSelected(event: ToolTextSelectionEvent): void {
        const text = event.range.toString()

        if (text.length > 1) {
            new TextSmudger(text).execute().then(result => {
                const selectedTexts = useModelStore.getState().selectedTexts;
                const newSelection: TextSelection[] = [];
                for (const selectedText of selectedTexts) {
                    newSelection.push({ ...selectedText, text: result, isLoading: false });
                }
                useUndoModelStore.getState().storeUndoState();
                useModelStore.getState().animateNextChanges();
                useModelStore.getState().setSelectedTexts(newSelection);
                useModelStore.getState().setSelectedTexts([]);
            });
          }
    }

    static getToolName() : string {
        return "Smudge";
    }


}