import * as React from "react"
import "./styles/Counter.css"
import { FAIcon } from "./icons.tsx";
import type { SectionLine } from "./SectionEditor.tsx";
import type { SectionDefinition } from "./Section.tsx";

export interface ActiveSectionMap {
    prevSection: SectionDefinition | null,
    activeSection: SectionDefinition | null,
    nextSection: SectionDefinition | null
}

interface CounterProps {
    title: string,
    sections: SectionLine[],
    setActiveSection: (section: ActiveSectionMap) => void
}

export const Counter = ({ title, sections, setActiveSection }: CounterProps) => {
    const [count, setCount] = React.useState(parseFloat(window.localStorage.getItem(`${title.toLowerCase()}Count`) || "0") || 0)

    const updateActiveSection = (c: number) => {
        if (title === "Row") {
            const sectionMap: SectionDefinition[] = []
            sections.forEach(section => {
                for (let repI = 0; repI <= section.repeatCount; repI++) {
                    for (let i = 0; i < parseInt((section.definition as SectionDefinition).rows || ((section.definition as SectionLine[])[0].definition as SectionDefinition).rows); i++) {
                        section.repeatCount > 0 ? 
                            (section.definition as SectionLine[]).forEach(sec => sectionMap.push(sec.definition as SectionDefinition)) :
                            sectionMap.push(section.definition as SectionDefinition) 
                    }
                }
            })
            // const parentIndexOf = sections.indexOf(sectionMap[c])
            // const startIndex = parentIndexOf > 0 ? parentIndexOf - 1 : parentIndexOf
            // // console.log("start index", startIndex)
            // const newActiveSection: ActiveSectionMap = {
            //     prevSection: startIndex === -1 ? null : parentIndexOf === 0 ? null : sections[startIndex],
            //     activeSection: startIndex === -1 ? null : parentIndexOf === 0 ? sections[startIndex] : sections[startIndex + 1],
            //     nextSection: startIndex === -1 ? null : parentIndexOf === sections.length ? null : sections[startIndex + 2]
            // }
            const newActiveSection: ActiveSectionMap = {
                prevSection: c === -1 ? null : c > 0 ? sectionMap[c-1] : null,
                activeSection: c === -1 ? null : sectionMap[c],
                nextSection: c === -1 ? null : c <= sectionMap.length ? sectionMap[c+1] : null
            }
            setActiveSection(newActiveSection)
        }
    }

    const updateCounter = (subtract: boolean = false): void | Error => {
        if (subtract) {
            if (count > 0) {
                setCount(c => c - 1)
                updateActiveSection(count - 1)
            } else {
                throw new Error("Cannot lower the count any further.")
            }
        } else {
            setCount(c => c + 1)
            updateActiveSection(count + 1)
        }
        window.localStorage.setItem(`${title.toLowerCase()}Count`, ((subtract ? count - 1 : count + 1)).toString())
        // handle project tracking
    }
    
    const updateCounterTo = (to: number) => {
        setCount(to)
        window.localStorage.setItem(`${title.toLowerCase()}Count`, "0")
        updateActiveSection(to)
    }

    // serve two buttons - one add, one subtract
    return (
        <div>
            <span className="counterButton-title">{ title }</span>
            <div className="counterButton-container">
                <button className="counterButton" onClick={() => updateCounter()}>{count}</button>
                <button className="counterButton subtract" onClick={() => updateCounter(true)}><FAIcon iconName="minus" /></button>
                <button className="counterButton reset" onClick={() => {
                    const confirmation = confirm("Are you sure you want to reset this counter?")
                    if (confirmation) {
                        updateCounterTo(0)
                    }
                }}><FAIcon iconName="rotate-left" /></button>
            </div>
        </div>
    )
}