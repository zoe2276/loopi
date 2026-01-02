import "./styles/SectionTicker.css"
import type { ActiveSectionMap } from "./Counter"

interface SectionTickerProps {
    activeSectionMap: ActiveSectionMap
}

export const SectionTicker = ({ activeSectionMap }: SectionTickerProps) => {
    return (
        <>
            { activeSectionMap.prevSection &&
                <div className="ticker prevSection">{activeSectionMap.prevSection.definition.value}</div>
            }
            { activeSectionMap.activeSection && 
                <div className="ticker activeSection">{activeSectionMap.activeSection.definition.value}</div>
            }
            { activeSectionMap.nextSection &&
                <div className="ticker nextSection">{activeSectionMap.nextSection.definition.value}</div>
            }
        </>
    )
}