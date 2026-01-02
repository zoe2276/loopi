import * as React from "react"
import { FAIcon } from "./icons.tsx"
import "./styles/Settings.css"

interface DefaultSettings {
    "accent-color": string,
    "background-color": string
}

export const Settings = () => {
    const defaults: DefaultSettings = {
        "accent-color": "#524552",
        "background-color": "#df96a1"
    }

    const getStylesheet = (variable: string) => {
        type dVar = keyof DefaultSettings
        return document.documentElement.style.getPropertyValue(`--${variable}`) || defaults[variable as dVar] || ""
    }

    const updateStylesheet = (variable: string, value: string) => {
        document.documentElement.style.setProperty(`--${variable}`, value)

        // use k,v pairs with json to encode into localstorage instead of raw css
        try {
            const rs = window.localStorage.getItem("userSettings")
            const settings = rs ? JSON.parse(rs) as Record<string, string> : {}
            settings[variable] = value
            window.localStorage.setItem("userSettings", JSON.stringify(settings))
        } catch { /* yum yum swallow errors */ }

        /* old way
        const ss = document.querySelector("style#userSettings") as HTMLStyleElement
        if (ss?.textContent.includes(`--${variable}:`)) {
            ss.textContent = ss.textContent.replace(new RegExp(`--${variable}: [^;]+;`), `--${variable}: ${value};`)
        } else {
            ss.textContent = ss.textContent.replace("}", `--${variable}: ${value};\n}`)
        }

        window.localStorage.setItem("userSettings", ss.textContent)
        */
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

    React.useEffect(() => {
        try {
            const rs = window.localStorage.getItem("userSettings")
            if (!rs) return
            const settings = JSON.parse(rs) as Record<string, string>
            for (const [k, v] of Object.entries(settings)) {
                document.documentElement.style.setProperty(`--${k}`, v)
            }
        } catch { /* yum yum */ }
        /* old way
        let styleSheet = document.querySelector("style#userSettings") as HTMLStyleElement
        if (!styleSheet) {
            styleSheet = document.createElement("style")
            styleSheet.id = "userSettings"
            styleSheet.appendChild(document.createTextNode(window.localStorage.getItem("userSettings") || ":root {\n\n}"))
            document.querySelector("head")?.appendChild(styleSheet)
        }
        */
    }, [])

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
                <ul className="settingsMenu-items">
                    <li>
                        <div>
                            Background Color
                            <input type="color" onChange={e => updateStylesheet("background-color", e.target.value)} defaultValue={getStylesheet("background-color")} />
                        </div>
                    </li>
                    <li>
                        <div>
                            Accent Color
                            <input type="color" onChange={e => updateStylesheet("accent-color", e.target.value)} defaultValue={getStylesheet("accent-color")} />
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}