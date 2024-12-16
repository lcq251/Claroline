import React from 'react'
import {PropTypes as T} from 'prop-types'
import {Redirect, Switch} from 'react-router-dom'

import {toKey} from '#/main/app/utils/text'
import {Route} from '#/main/app/router/components/route'
import {Route as RouteTypes} from '#/main/app/router/prop-types'

const Routes = ({routes, path = '', exact = false, redirect = []}) =>
  <Switch>
    {routes
      .filter(route => !route.disabled)
      .map((route) =>
        <Route
          {...route}
          key={toKey(route.path)}
          path={path+route.path}
        />
      )
    }

    {redirect
      .filter(redirectRoute => !redirectRoute.disabled)
      .map((redirectRoute, redirectIndex) =>
        <Redirect
          {...redirectRoute}
          key={`redirect-${redirectIndex}`}
          from={path+redirectRoute.from}
          to={path+redirectRoute.to}
        />
      )
    }
  </Switch>

Routes.propTypes = {
  path: T.string,
  exact: T.bool,
  routes: T.arrayOf(
    T.shape(RouteTypes.propTypes).isRequired
  ),
  redirect: T.arrayOf(T.shape({
    disabled: T.bool,
    from: T.string.isRequired,
    to: T.string.isRequired,
    exact: T.bool
  }))
}

export {
  Routes
}
