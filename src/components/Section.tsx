import * as React from "react"
import { FAIcon } from "./icons"
import type { SectionLine } from "./SectionEditor"
import "./styles/Section.css"

export interface SectionDefinition {
    value: string,
    rows: string
}

interface SectionProps {
    id: string,
    mode: string,
    sectionLine: SectionLine,
    onChange: (upd: SectionLine) => void,
    handleRemove: () => void,
    handleAdd: () => void
}

export const Section = ({id, mode, sectionLine, onChange, handleRemove, handleAdd}: SectionProps) => {

    return (
        mode === "edit" ?
        <div className="editSection">
            <button onClick={handleRemove}>
                <FAIcon iconName="trash" />
            </button>
            <input id={`sectionEditor-value-${id}`} className="sectionEditor-input value" placeholder="Pattern" value={sectionLine.definition.value} onChange={e => onChange({...sectionLine, definition: {...sectionLine.definition, value: e.target.value}})}></input>
            <input id={`sectionEditor-row-${id}`} className="sectionEditor-input row" placeholder="Rows" type="number" value={sectionLine.definition.rows} onChange={e => onChange({...sectionLine, definition: {...sectionLine.definition, rows: e.target.value}})}></input>
            <button onClick={handleAdd}>
                <FAIcon iconName="plus" />
            </button>
        </div> :
        `${sectionLine.definition.value} (x${sectionLine.definition.rows})`
    )
}