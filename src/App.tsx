import { Counter } from './components/Counter'
import './App.css'

function App() {

  return (
    <>
      <h1>Loopi</h1>
      <div className="counter-container">
        <Counter title="Row" />
        <Counter title="Stitch" />
      </div>
    </>
  )
}

export default App
