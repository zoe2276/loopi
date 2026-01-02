import * as React from 'react'
import { Counter, type ActiveSectionMap } from './components/Counter.tsx'
import './App.css'
import { Settings } from './components/Settings.tsx'
import { SectionEditor, type SectionLine } from './components/SectionEditor.tsx'
import { SectionTicker } from "./components/SectionTicker.tsx"
import { getData, initDb } from './composables/indDb.ts'

export interface Pattern {
  name: string,
  definition: SectionLine[]
}

function App() {
  const [patterns, setPatterns] = React.useState<Pattern[]|[]>([])
  const [sections, setSections] = React.useState<SectionLine[]|[]>([])
  const [activeSectionMap, setActiveSectionMap] = React.useState<ActiveSectionMap>({} as ActiveSectionMap)
  const [dbReady, setDbReady] = React.useState<boolean>(false)

  const handleSectionUpdate = (upd: SectionLine[]|((upd: SectionLine[]) => SectionLine[]) ) => {
    setSections(upd as never[])
  }

  const handleSetActiveSection = (upd: ActiveSectionMap) => {
    // we also want the index of the active section so we can get the sister sections
    setActiveSectionMap(upd)
  }

  const handleSetPatterns = (upd: Array<Pattern>) => {
    setPatterns(upd as never[])
  }

  React.useEffect(() => {
    const handleInitDb = async () => setDbReady(await initDb())
    handleInitDb()

    // get current patterns
    const loadPatterns = async () => setPatterns(await getData<Pattern>("Patterns"))
    loadPatterns()
  }, [])

  return (
    <>
      <div role="navigation">
        <SectionEditor sections={sections} setSections={handleSectionUpdate} patterns={patterns} setPatterns={handleSetPatterns} setActiveSectionMap={handleSetActiveSection} />
        <Settings />
      </div>
      <h2>loopi{dbReady}</h2>
      <div className="counter-container">
        <Counter title="Row" sections={sections} setActiveSection={handleSetActiveSection} />
        <Counter title="Stitch" sections={sections} setActiveSection={handleSetActiveSection} />
      </div>
      <div className="ticker-container">
        <SectionTicker activeSectionMap={activeSectionMap} />
      </div>
    </>
  )
}

export default App
