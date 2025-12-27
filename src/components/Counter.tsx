import * as React from "react"
import "./styles/Counter.css"

interface CounterProps {
    title: string;
}

export const Counter = ({ title }: CounterProps) => {
    const [count, setCount] = React.useState(parseFloat(window.localStorage.getItem(`${title.toLowerCase()}Count`) || "0") || 0)

    const updateCounter = (subtract: boolean = false): void | Error => {
        if (subtract) {
            if (count > 0) {
                setCount(c => c - 1)
            } else {
                throw new Error("Cannot lower the count any further.")
            }
        } else {
            setCount(c => c + 1)
        }
        window.localStorage.setItem(`${title.toLowerCase()}Count`, (count + 1).toString())
    }

    // serve two buttons - one add, one subtract
    return (
        <div>
            <span className="counterButton-title">{ title }</span>
            <div className="counterButton-container">
                <button className="counterButton" onClick={() => updateCounter()}>{count}</button>
                <button className="counterButton subtract" onClick={() => updateCounter(true)}>-</button>
            </div>
        </div>
    )
}