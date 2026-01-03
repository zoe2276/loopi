import * as React from "react"
import { FAIcon } from "./icons.tsx"
import type { SectionLine } from "./SectionEditor.tsx"
import { newIdFactory } from "../composables/secIdFactory.ts"
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
    const updateField = React.useCallback(<K extends keyof Omit<SectionLine, "children">>(k: K, upd: SectionLine[K]) => {
        onChange({...sectionLine, [k]: upd})
    }, [sectionLine, onChange])

    const updateChild = React.useCallback((childId: string, upd: SectionLine) => {
        const updChildren = (sectionLine.definition as SectionLine[]).map(sec => sec.id === childId ? upd : sec) as SectionLine[]
        onChange({...sectionLine, definition: updChildren})
    }, [sectionLine, onChange])

    const addChild = React.useCallback(() => {
        const newId = makeId()
        const newChild: SectionLine = {
            id: newId,
            status: "incomplete",
            definition: {
                value: "",
                rows: ""
            },
            repeatCount: 0
        }
        onChange({ ...sectionLine, definition: [...(sectionLine.definition as SectionLine[]), newChild]})
    }, [sectionLine, onChange])

    const deleteChild = React.useCallback((childId: string) => {
        onChange({ ...sectionLine, definition: (sectionLine.definition as SectionLine[]).filter(c => c.id !== childId)})
    }, [sectionLine, onChange])

    const makeId = React.useMemo(() => newIdFactory("childSec"), [])

    return (
        sectionLine.repeatCount === 0 ?
            mode === "edit" ?
            <div className="editSection">
                <button onClick={handleRemove}>
                    <FAIcon iconName="trash" />
                </button>
                <input id={`sectionEditor-value-${id}`} className="sectionEditor-input value" placeholder="Pattern" value={(sectionLine.definition as SectionDefinition).value} onChange={e => updateField("definition", {...(sectionLine.definition as SectionDefinition), value: e.target.value})}></input>
                <input id={`sectionEditor-row-${id}`} className="sectionEditor-input row" placeholder="Rows" type="number" value={(sectionLine.definition as SectionDefinition).rows} onChange={e => updateField("definition", {...(sectionLine.definition as SectionDefinition), rows: e.target.value})}></input>
                <button onClick={handleAdd}>
                    <FAIcon iconName="plus" />
                </button>
            </div> :
            `${(sectionLine.definition as SectionDefinition).value} (x${(sectionLine.definition as SectionDefinition).rows})`
        :
            <>
                <div style={{display: "flex", alignItems: "center"}}>
                    {mode === "edit" && <button onClick={handleRemove}>
                        <FAIcon iconName="trash" />
                    </button>}
                    <div>Repeat <input className="repeatSection-repeatCount sectionEditor-input row" type="number" placeholder="#" value={sectionLine.repeatCount} onChange={e => onChange({...sectionLine, repeatCount: parseInt(e.target.value)})} disabled={mode !== "edit"}/> times</div>
                    {mode === "edit" && <button onClick={addChild}>
                        <FAIcon iconName="plus" />
                    </button>}
                </div>
                <ol>
                    { (sectionLine.definition as SectionLine[]).map((sec, idx) => <li key={idx} style={{textAlign: "start"}} className={sec.status}>
                        <Section id={sec.id}
                            mode={mode}
                            sectionLine={sec}
                            onChange={(upd) => updateChild(sec.id, upd)}
                            handleAdd={addChild}
                            handleRemove={() => deleteChild(sec.id)}
                        />
                    </li>)}
                </ol>
            </>
            
    )
}