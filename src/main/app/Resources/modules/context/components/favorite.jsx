import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'

import {selectors as contextSelectors} from '#/main/app/context/store'
import {actions as platformActions, selectors as platformSelectors} from '#/main/app/platform/store'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

import {selectors as securitySelectors} from '#/main/app/security/store'

const ContextFavourite = ({
  className
}) => {
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(securitySelectors.isAuthenticated)
  const contextType = useSelector(contextSelectors.type)
  const contextData = useSelector(contextSelectors.data)
  const favourite = useSelector((state) => platformSelectors.isContextFavorite(state, contextData))

  if (!isAuthenticated || 'workspace' !== contextType) {
    return null;
  }

  return (
    <Button
      id="toggle-favorite"
      className={classes('btn btn-text-body p-1 focus-ring ms-n1', className)}
      type={CALLBACK_BUTTON}
      label={trans(favourite ? 'remove-favourite' : 'add-favourite', {}, 'actions')}
      icon={classes('fa fs-base', {
        'fa-star text-warning': favourite,
        'far fa-star': !favourite
      })}
      callback={() => dispatch(platformActions.saveFavorite(contextData))}
      size="sm"
    />
  )
}

ContextFavourite.propTypes = {
  className: T.string
}

export {
  ContextFavourite
}
