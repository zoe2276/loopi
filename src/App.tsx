import { Counter } from './components/Counter'
import './App.css'
import { Settings } from './components/Settings'
import { SectionEditor, type SectionLine } from './components/SectionEditor'
import { getData, initDb } from './composables/indDb'
import * as React from 'react'

export interface Pattern {
  name: string,
  definition: SectionLine[]
}

function App() {
  const [patterns, setPatterns] = React.useState<Pattern[]|[]>([])
  const [sections, setSections] = React.useState<SectionLine[]|[]>([])
  const [dbReady, setDbReady] = React.useState<boolean>(false)

  const handleSectionUpdate = (upd: SectionLine[]|((upd: SectionLine[]) => SectionLine[]) ) => {
    setSections(upd as never[])
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
        <SectionEditor sections={sections} setSections={handleSectionUpdate} patterns={patterns} setPatterns={handleSetPatterns} />
        <Settings />
      </div>
      <h2>loopi{dbReady}</h2>
      <div className="counter-container">
        <Counter title="Row" />
        <Counter title="Stitch" />
      </div>
    </>
  )
}

export default App
