import { FAIcon } from "./icons";
import "./styles/SectionEditor.css"

export const SectionEditor = ({ style = "full" }: { style: string }) => {
    return (
        <button className={`sectionEditor ${style}`}>
            <FAIcon iconName="history" />
        </button>
    )
}