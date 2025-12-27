import { Counter } from './components/Counter'
import './App.css'

function App() {

  return (
    <>
      <h2>loopi</h2>
      <div className="counter-container">
        <Counter title="Row" />
        <Counter title="Stitch" />
      </div>
    </>
  )
}

export default App
