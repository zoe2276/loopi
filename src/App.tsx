import { Counter } from './components/Counter'
import './App.css'
import { Settings } from './components/Settings'
import { SectionEditor } from './components/SectionEditor'

function App() {

  return (
    <>
      <div role="navigation">
        <SectionEditor style="mini" />
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
