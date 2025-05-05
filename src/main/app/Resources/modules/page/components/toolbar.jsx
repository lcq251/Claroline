import React from 'react'
import classes from 'classnames'

import {Toolbar} from '#/main/app/action'

const PageToolbar = ({toolbar, actions, size = 'lg'}) => {
  return (
    <div className={classes('sticky-top', size && `content-${size}`)} role="presentation" style={{height: 0}}>
      <Toolbar
        className="app-page-toolbar d-inline-flex flex-column my-5 gap-1"
        buttonName="btn btn-link focus-ring bg-body lh-sm rounded-circle"
        tooltip="left"
        toolbar={toolbar}
        actions={actions}
        scope="object"
      />
    </div>
  )
}

export {
  PageToolbar
}
