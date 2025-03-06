import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {ThemeIcon} from '#/main/theme/components/icon'

const ResourceIcon = props =>
  <ThemeIcon
    className={classes('resource-icon flex-shrink-0', props.className)}
    mimeType={props.mimeType}
    set="resources"
    size={props.size}
  />

ResourceIcon.propTypes = {
  className: T.string,
  size: T.string,
  mimeType: T.string
}

export {
  ResourceIcon
}
