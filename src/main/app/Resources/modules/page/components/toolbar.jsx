import React, {useContext} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Toolbar} from '#/main/app/action'
import {PageContext} from '#/main/app/page/context'
import {Action, PromisedAction} from '#/main/app/action/prop-types'

const PageToolbarSkeleton = ({ toolbar, size = 'lg' }) => {
  const pageDef = useContext(PageContext)

  const buttons = toolbar.split(' ')

  return (
    <div className={classes('app-page-toolbar', !pageDef.embedded && 'sticky-top', size && `content-${size}`)} role="presentation" style={{height: 0}}>
      <div className={classes('d-inline-flex flex-column gap-1', {
        'my-5': !pageDef.embedded
      })} role="presentation">
        {buttons.map(() =>
          <button className="placeholder btn btn-link lh-sm rounded-circle shadow-none" aria-disabled={true}>
            <span className="fa fa-fw" />
          </button>
        )}
      </div>
    </div>
  )
}

PageToolbarSkeleton.propTypes = {
  toolbar: T.string.isRequired,
  size: T.oneOf(['sm', 'md', 'lg', 'xl', 'full'])
}

const PageToolbar = ({ toolbar, actions, size = 'lg' }) => {
  const pageDef = useContext(PageContext)

  return (
    <div className={classes('app-page-toolbar', !pageDef.embedded && 'sticky-top', size && `content-${size}`)} role="presentation" style={{height: 0}}>
      <Toolbar
        className={classes('d-inline-flex flex-column gap-1', {
          'my-5': !pageDef.embedded
        })}
        buttonName="btn btn-link focus-ring lh-sm rounded-circle"
        tooltip="left"
        toolbar={toolbar}
        actions={actions}
        scope="object"
      />
    </div>
  )
}

PageToolbar.propTypes = {
  toolbar: T.string,
  actions: T.oneOfType([
    // a regular array of actions
    T.arrayOf(T.shape(
      Action.propTypes
    )),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedAction.propTypes
    )
  ]),
  size: T.oneOf(['sm', 'md', 'lg', 'xl', 'full'])
}

export {
  PageToolbar,
  PageToolbarSkeleton
}
