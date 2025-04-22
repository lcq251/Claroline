import React from 'react'
import {useSelector} from 'react-redux'
import classes from 'classnames'

import {selectors} from '#/main/app/api/store'

const AppLoader = () => {
  const currentRequests = useSelector(selectors.currentRequests)

  return (
    <div className={classes('app-loader position-fixed', currentRequests && 'show')} role="progressbar" aria-hidden={!currentRequests}>
      <span className="visually-hidden">The app is currently loading...</span>
    </div>
  )
}

export {
  AppLoader
}
