import "./styles/SectionTicker.css"
import type { ActiveSectionMap } from "./Counter.tsx"

interface SectionTickerProps {
    activeSectionMap: ActiveSectionMap
}

export const SectionTicker = ({ activeSectionMap }: SectionTickerProps) => {
    return (
        <>
            { activeSectionMap.prevSection &&
                <div className="ticker prevSection">{activeSectionMap.prevSection.value}</div>
            }
            { activeSectionMap.activeSection && 
                <div className="ticker activeSection">{activeSectionMap.activeSection.value}</div>
            }
            { activeSectionMap.nextSection &&
                <div className="ticker nextSection">{activeSectionMap.nextSection.value}</div>
            }
        </>
    )
}