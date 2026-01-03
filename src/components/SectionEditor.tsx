import * as React from "react"
import { FAIcon } from "./icons.tsx"
import { Section, type SectionDefinition } from "./Section.tsx"
import { addData, getData } from "../composables/indDb.ts"
import type { ActiveSectionMap } from "./Counter.tsx"
import { type Pattern } from "../App.tsx"
import "./styles/SectionEditor.css"
// import { RepeatSection } from "./RepeatSection.tsx"
import { newIdFactory } from "../composables/secIdFactory.ts"

export interface SectionLine {
    id: string,
    status: string,
    definition: SectionDefinition|SectionLine[],
    repeatCount: number
}

interface SectionEditorProps {
    sections: Array<SectionLine>,
    setSections: (upd: SectionLine[]|((upd: SectionLine[]) => SectionLine[])) => void,
    patterns: Pattern[],
    setPatterns: (upd: Pattern[]) => void,
    setActiveSectionMap: (upd: ActiveSectionMap) => void
}

export const SectionEditor = ({ sections, setSections, patterns, setPatterns, setActiveSectionMap }: SectionEditorProps) => {
    const [editing, setEditing] = React.useState(false)
    const [repeating, setRepeating] = React.useState<boolean>(false)
    const [cacheSection, setCacheSection] = React.useState(Array<SectionLine>) // used to preserve previous state for discard ops

    const showSectionMenu = () => {
        const sectionMenu = document.getElementById("sectionMenu")
        const sectionUnderlay = document.getElementById("sectionMenu-underlay")
        sectionUnderlay?.classList.add("shown")
        sectionMenu?.classList.remove("slideOut")
        sectionMenu?.classList.add("slideIn")
        sectionMenu?.addEventListener("animationend", () => {
            sectionMenu.classList.add("shown")
            sectionMenu.classList.remove("slideIn")
        })
    }

    const hideSectionMenu = () => {
        const sectionMenu = document.getElementById("sectionMenu")
        const sectionUnderlay = document.getElementById("sectionMenu-underlay")
        sectionUnderlay?.classList.remove("shown")
        sectionMenu?.classList.remove("slideIn")
        sectionMenu?.classList.add("slideOut")
        sectionMenu?.addEventListener("animationend", () => {
            sectionMenu.classList.remove("shown")
            sectionMenu?.classList.remove("slideOut")
        })
        if (sections) setActiveSectionMap({
            prevSection: null,
            activeSection: sections[0].definition as SectionDefinition,
            nextSection: sections[1].definition as SectionDefinition
        } as ActiveSectionMap)
    }

    const enableSectionEditMode = () => {
        setEditing(true)
        setCacheSection(sections)
    }

    const toggleRepeat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const newR = !repeating
        setRepeating(newR)
        const t = e.target as HTMLElement
        newR ? t.classList.add("active") : t.classList.remove("active")
    }

    const saveSection = () => {
        const patternTitle = document.getElementById("sectionMenu-patternTitle") as HTMLInputElement
        const title = patternTitle?.value

        if (!title) {
            if (confirm("Saving without a pattern title will not allow you to recover this pattern. Are you sure you would like to continue?")) {
                setEditing(false)
            }
            return
        }

        savePattern(title, sections)
        getData<Pattern>("Patterns").then((p: Pattern[]) => setPatterns(p))
        setEditing(false)
    }

    const discardSection = () => {
        setEditing(false)
        setSections(cacheSection)
    }

    const resetSection = () => {
        if (confirm("Resetting this pattern can not be undone. Are you sure you want to continue?")) {
            setEditing(false)
            setSections(new Array<SectionLine>)
        }
    }

    const addNewRow = (idx: number = -1) => {
        const newRowData = repeating ? {
            id: makeId(),
            status: "incomplete",
            definition: [],
            repeatCount: 1
        } as SectionLine : {
            id: makeId(),
            status: "incomplete",
            definition: {
                value: "",
                rows: ""
            },
            repeatCount: 0
        } as SectionLine
        const lSec = Array.from(sections)
        if (idx > -1) {
            lSec.splice(idx + 1, 0, newRowData)
        } else {
            lSec.push(newRowData)
        }
        setSections(lSec)
        console.log(lSec)
    }

    const removeRow = (idx: number) => {
        // console.log("removing at " + idx)
        const lSec = Array.from(sections)
        lSec.splice(idx, 1)
        setSections(lSec)
        console.log(sections)
    }

    const savePattern = async (name: string, definition: object) => {
        try {
            await addData("Patterns", { name, definition })
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message)
            } else {
                console.error("something went wrong")
            }
        }
    }

    const handlePatternSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPattern = patterns.find(pat => pat.name === e.target.value)
        if (selectedPattern) {
            setSections(selectedPattern.definition)
        }
    }
    
    const makeId = React.useMemo(() => newIdFactory("sec"), [])

    return (
        <>
            <button className="sectionEditor" onClick={() => showSectionMenu()}>
                <FAIcon iconName="list-ol" />
            </button>
            <div id="sectionMenu-underlay" onClick={() => hideSectionMenu()} />
            <div id="sectionMenu">
                <button id="sectionMenu-close" onClick = {() => hideSectionMenu()}>
                    <FAIcon iconName="x" />
                </button>
                {
                    editing ?
                    <>
                        <div id="sectionMenu-patternTitle-container">
                            <input id="sectionMenu-patternTitle" type="text" placeholder="Pattern Title" />
                        </div>
                        <div id="sectionMenu-actions">
                            <button id="sectionMenu-discard" onClick={() => discardSection()}>
                                <FAIcon iconName="delete-left" />
                            </button>
                            <button id="sectionMenu-save" onClick={() => saveSection()}>
                                <FAIcon iconName="floppy-disk" />
                            </button>
                        </div>
                    </> :
                    <>
                        <div id="sectionMenu-patternSelect-container">
                            <select name="Patterns" id="sectionMenu-patternSelect" defaultValue={""} onChange={handlePatternSelect}>
                                { patterns.length > 0 ?
                                    <>
                                    <option style={{display: "none"}}></option>
                                    {patterns.map((elem: Pattern) => <option key={elem.name}>{elem.name}</option>) }
                                    </> :
                                    <option disabled>No saved patterns found.</option>
                                }
                            </select>
                        </div>
                        <button id="sectionMenu-edit" onClick={() => enableSectionEditMode()}>
                            <FAIcon iconName="pen" />
                        </button>
                        <button id="sectionMenu-reset" onClick={() => resetSection()}>
                            <FAIcon iconName="undo" />
                        </button>
                    </>
                }
                <div id="sectionMenu-items-container">
                    { sections.length > 0 ?
                        <ol>
                            {
                            sections.map((section, idx) => <li key={idx} style={{textAlign: "start"}} className={section.status}>
                                <Section id={idx.toString()}
                                    mode={editing ? "edit" : "view"}
                                    sectionLine={section}
                                    onChange={upd => setSections((prev: SectionLine[]) => prev.map((sec, i) => (i === idx ? upd : sec)))}
                                    handleAdd={() => addNewRow(idx)}
                                    handleRemove={() => removeRow(idx)} /> 
                                </li>) 
                            }
                            {
                                editing &&
                                <div id="sectionMenu-actionButton-container">
                                    <button className="sectionMenu-addNewRow" onClick={() => addNewRow()}>
                                        <FAIcon iconName="plus" />
                                    </button>
                                    <button id="sectionMenu-enableRepeat" onClick={e => toggleRepeat(e)}>
                                        <FAIcon iconName="repeat" />
                                    </button>
                                    <div className="sectionMenu-editDisabled">Use a larger screen to edit.</div>
                                </div>
                            }
                        </ol> : editing ? 
                            <div id="sectionMenu-actionButton-container">
                                <button className="sectionMenu-addNewRow" onClick={() => addNewRow()}>
                                    <FAIcon iconName="plus" />
                                </button>
                                <div className="sectionMenu-editDisabled">Use a larger screen to add rows.</div>
                            </div> : 
                            <div style={{display: "flex", fontStyle: "italic", justifyContent: "center"}}>No sections found.</div>
                    }
                </div>
            </div>
        </>
    )
}