import * as React from 'react'
import { Counter, type ActiveSectionMap } from './components/Counter.tsx'
import { Notes } from './components/Notes.tsx'
import { Settings } from './components/Settings.tsx'
import { SectionEditor, type SectionLine } from './components/SectionEditor.tsx'
import { SectionTicker } from "./components/SectionTicker.tsx"
import { addData, getData, initDb } from './composables/indDb.ts'
import './App.css'

export interface Pattern {
  name: string,
  definition: SectionLine[],
  notes: string[]
}

function App() {
  const [patterns, setPatterns] = React.useState<Pattern[]|[]>([])
  const [activePatternTitle, setActivePatternTitle] = React.useState<string>()
  const [sections, setSections] = React.useState<SectionLine[]|[]>([])
  const [activeSectionMap, setActiveSectionMap] = React.useState<ActiveSectionMap>({} as ActiveSectionMap)
  const [notes, setNotes] = React.useState<string[]>(["","","","","",""])
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

  const handleSetActivePatternTitle = (upd: string) => {
    setActivePatternTitle(upd)
  }

  const handleSetNotes = (upd: string[]|((upd: string[]) => string[]), save: boolean = false) => {
    setNotes(upd)
    if (save) handleSaveNotesToPattern(upd)
  }

  const handleSaveNotesToPattern = async (upd: string[]|((upd: string[]) => string[])) => {
    const definition = sections
    const name = activePatternTitle
    const updVal = typeof upd === "function" ? upd(notes) : upd
    try {
        await addData("Patterns", { name, definition, notes: updVal })
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message)
        } else {
            console.error("something went wrong")
        }
    }
    getData<Pattern>("Patterns").then((p: Pattern[]) => setPatterns(p))
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
        <SectionEditor sections={sections} setSections={handleSectionUpdate} patterns={patterns} setPatterns={handleSetPatterns} notes={notes} setNotes={handleSetNotes} setActiveSectionMap={handleSetActiveSection} setActivePatternTitle={handleSetActivePatternTitle} />
        <Settings />
      </div>
      <h2>loopi{dbReady}</h2>
      <div className="counter-container">
        <Counter title="Row" sections={sections} setActiveSection={handleSetActiveSection} />
        <Counter title="Stitch" sections={sections} setActiveSection={handleSetActiveSection} />
      </div>
      <div id="footer">
        <div className="ticker-container">
          <SectionTicker activeSectionMap={activeSectionMap} />
        </div>
        <div className="notes-container" >
          <Notes notes={notes} setNotes={(upd) => handleSetNotes(upd, true)} />
        </div>
      </div>
    </>
  )
}

export default App
