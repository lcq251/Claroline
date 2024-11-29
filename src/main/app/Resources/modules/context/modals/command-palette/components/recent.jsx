import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

const CommandPaletteRecent = (props) => {
  if (isEmpty(props.recent)) {
    return null
  }

  return (
    <div className="border-bottom p-4">
      <h5 className="fs-sm text-uppercase text-body-secondary">Récent</h5>
    </div>
  )
}

CommandPaletteRecent.propTypes = {
  recent: T.array
}

export {
  CommandPaletteRecent
}
