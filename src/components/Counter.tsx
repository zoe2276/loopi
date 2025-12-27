import * as React from "react"
import "./styles/Counter.css"
import { FAIcon } from "./icons";

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
        window.localStorage.setItem(`${title.toLowerCase()}Count`, ((subtract ? count - 1 : count + 1)).toString())
    }

    const updateCounterTo = (to: number) => {
        setCount(to)
        window.localStorage.setItem(`${title.toLowerCase()}Count`, "0")
    }

    // serve two buttons - one add, one subtract
    return (
        <div>
            <span className="counterButton-title">{ title }</span>
            <div className="counterButton-container">
                <button className="counterButton" onClick={() => updateCounter()}>{count}</button>
                <button className="counterButton subtract" onClick={() => updateCounter(true)}><FAIcon iconName="minus" /></button>
                <button className="counterButton reset" onClick={() => {
                    const confirmation = confirm("Are you sure you want to reset this counter?")
                    if (confirmation) {
                        updateCounterTo(0)
                    }
                }}><FAIcon iconName="rotate-left" /></button>
            </div>
        </div>
    )
}