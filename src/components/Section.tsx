import * as React from "react"
import { FAIcon } from "./icons"
import "./styles/Section.css"

interface SectionProps {
    id: string,
    mode: string,
    handleRemove: () => void
    handleAdd: () => void
}

export const Section = ({id, mode, handleRemove, handleAdd}: SectionProps) => {
    const [value, setValue] = React.useState("")
    const [rows, setRows] = React.useState("")

    return (
        mode === "edit" ?
        <div className="editSection">
            <button onClick={handleRemove}>
                <FAIcon iconName="trash" />
            </button>
            <input id={`sectionEditor-value-${id}`} className="sectionEditor-input value" placeholder="Pattern" value={value} onChange={e => setValue(e.target.value)}></input>
            <input id={`sectionEditor-row-${id}`} className="sectionEditor-input row" placeholder="Rows" type="number" value={rows} onChange={(e) => setRows(e.target.value)}></input>
            <button onClick={handleAdd}>
                <FAIcon iconName="plus" />
            </button>
        </div> :
        `${value} (x${rows})`
    )
}