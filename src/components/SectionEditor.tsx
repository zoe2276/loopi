import * as React from "react"
import { FAIcon } from "./icons"
import "./styles/SectionEditor.css"

interface Section {
    status: string,
    value: string
}

interface SectionEditorProps {
    sections: Array<Section>,
    setSections: React.Dispatch<React.SetStateAction<Array<Section>>>
}

export const SectionEditor = ({ sections, setSections }: SectionEditorProps) => {
    const [editing, setEditing] = React.useState(false)
    const [cacheSection, setCacheSection] = React.useState(Array<Section>) // used to preserve previous state for discard ops

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
    }

    const enableSectionEditMode = () => {
        setEditing(true)
        setCacheSection(sections)
    }

    const saveSection = () => {
        setEditing(false)
    }

    const discardSection = () => {
        setEditing(false)
        setSections(cacheSection)
    }

    const resetSection = () => {
        if (confirm("Resetting this pattern can not be undone. Are you sure you want to continue?")) {
            setEditing(false)
            setSections(new Array<Section>)
        }
    }

    const addNewRow = (idx: number = -1) => {
        const lSec = Array.from(sections)
        if (idx > -1) {
            const beg = lSec.slice(0, idx)
            const end = lSec.slice(idx +1, lSec.length - 1)
            const newSec = { status: "incomplete", value: ""} as Section
            beg.push(newSec)
            end.forEach(sec => beg.push(sec))
            setSections(beg)
        } else {
            lSec.push({ status: "incomplete", value: "" } as Section)
            setSections(lSec)
        }
    }

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
                    <div id="sectionMenu-actions">
                        <button id="sectionMenu-discard" onClick={() => discardSection()}>
                            <FAIcon iconName="delete-left" />
                        </button>
                        <button id="sectionMenu-save" onClick={() => saveSection()}>
                            <FAIcon iconName="floppy-disk" />
                        </button>
                    </div> :
                    <>
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
                            sections.map((section, idx) => <li className={section.status}>{
                                editing ?
                                <div className="editSection">
                                    <button>
                                        <FAIcon iconName="pen" />
                                    </button>
                                    {section.value}
                                    <button onClick={() => addNewRow(idx)}>
                                        <FAIcon iconName="plus" />
                                    </button>
                                </div> :
                                section.value}
                                </li>) 
                            }
                            {
                                editing &&
                                <button className="sectionMenu-addNewRow" onClick={() => addNewRow()}>
                                    <FAIcon iconName="plus" />
                                </button>
                            }
                        </ol> : editing ? 
                            <>
                                <button className="sectionMenu-addNewRow" onClick={() => addNewRow()}>
                                    <FAIcon iconName="plus" />
                                </button>
                                <div className="sectionMenu-editDisabled">Use a larger screen to edit.</div>
                            </> : 
                            <div style={{display: "flex", fontStyle: "italic", justifyContent: "center"}}>No sections found.</div>
                    }
                </div>
            </div>
        </>
    )
}