import { Counter } from './components/Counter'
import './App.css'
import { Settings } from './components/Settings'
import { SectionEditor, type SectionLine } from './components/SectionEditor'
import * as React from 'react'

function App() {
  const [sections, setSections] = React.useState([])

  const handleSectionUpdate = (upd: Array<SectionLine>) => {
    setSections(upd as never[])
  }
  return (
    <>
      <div role="navigation">
        <SectionEditor sections={sections} setSections={handleSectionUpdate} />
        <Settings />
      </div>
      <h2>loopi</h2>
      <div className="counter-container">
        <Counter title="Row" />
        <Counter title="Stitch" />
      </div>
    </>
  )
}

export default App
