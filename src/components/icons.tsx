import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { findIconDefinition, library, type IconName } from '@fortawesome/fontawesome-svg-core'

import { fas } from "@fortawesome/free-solid-svg-icons"

library.add(fas)

export const FAIcon = ({iconName}: {iconName: IconName}) => {
    return (
        <FontAwesomeIcon icon={findIconDefinition({prefix: "fas", iconName: iconName})} />
    )
}