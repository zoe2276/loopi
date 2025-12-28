import { Counter } from './components/Counter'
import './App.css'
import { Settings } from './components/Settings'
import { SectionEditor } from './components/SectionEditor'
import * as React from 'react'

function App() {
  const [sections, setSections] = React.useState([])
  return (
    <>
      <div role="navigation">
        <SectionEditor style="mini" sections={sections} setSections={setSections} />
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
