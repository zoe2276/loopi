import * as React from "react"
import { FAIcon } from "./icons"
import "./styles/Settings.css"

export const Settings = () => {
    const [backgroundColor, setBackgroundColor] = React.useState("#ffb6c1dd")

    const updateBackgroundColor = (color: string) => {
        setBackgroundColor(color)
        document.querySelector("body").style = `background-color: ${color}`
    }

    const showSettingsMenu = () => {
        const settingsMenu = document.getElementById("settingsMenu")
        const settingsUnderlay = document.getElementById("settingsMenu-underlay")
        settingsUnderlay?.classList.add("shown")
        settingsMenu?.classList.remove("slideRight")
        settingsMenu?.classList.add("slideLeft")
        settingsMenu?.addEventListener("animationend", () => {
            settingsMenu.classList.add("shown")
            settingsMenu.classList.remove("slideLeft")
        })
    }

    const hideSettingsMenu = () => {
        const settingsMenu = document.getElementById("settingsMenu")
        const settingsUnderlay = document.getElementById("settingsMenu-underlay")
        settingsUnderlay?.classList.remove("shown")
        settingsMenu?.classList.remove("slideLeft")
        settingsMenu?.classList.add("slideRight")
        settingsMenu?.addEventListener("animationend", () => {
            settingsMenu.classList.remove("shown")
            settingsMenu?.classList.remove("slideRight")
        })
    }

    return (
        <>
            <button className="settingsButton" onClick={() => showSettingsMenu()}>
                <FAIcon iconName="gear" />
            </button>
            <div id="settingsMenu-underlay" onClick={() => hideSettingsMenu()} />
            <div id="settingsMenu">
                <button id="settingsMenu-close" onClick = {() => hideSettingsMenu()}>
                    <FAIcon iconName="x" />
                </button>
                Background Color
                <input type="color" onChange={e => updateBackgroundColor(e.target.value)} />
            </div>
        </>
    )
}