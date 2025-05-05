import React from "react";
import { ToolbarTool } from "./ToolbarTool";
import { SelectIcon } from "../../../view/components/icons/CustomIcons";

export class SelectionTool extends ToolbarTool {
    constructor() {
        super(SelectionTool.getToolName());
    }

    getMarksClassname() : string {
        return "textSelection" // Marks will use this class
    }

    getIcon() : React.ReactElement {
        return <SelectIcon />
    }

    static getToolName() : string {
        return "Select";
    }

    isIconAsCursor() : boolean {
        return false;
    }
}