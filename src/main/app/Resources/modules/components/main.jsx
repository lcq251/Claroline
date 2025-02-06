import React from 'react'
import {PropTypes as T} from 'prop-types'
import {Provider} from 'react-redux'

import {Router} from '#/main/app/router'

// implemented overlays
import {ModalOverlay} from '#/main/app/overlays/modal/containers/overlay'
import {AlertOverlay} from '#/main/app/overlays/alert/containers/overlay'
import {Appearance} from '#/main/theme/components/appearance'
import {AppLoader} from '#/main/app/platform/components/loader'

const Main = ({
  store,
  children,
  defaultPath = '',
  embedded = false
}) =>
  <Provider store={store}>
    <Appearance embedded={embedded}>
      <Router basename={defaultPath} embedded={embedded}>
        {!embedded &&
          <AppLoader />
        }

        <AlertOverlay key="alert" />

        {children}

        <ModalOverlay key="modal" />
      </Router>
    </Appearance>
  </Provider>

Main.propTypes = {
  defaultPath: T.string,
  embedded: T.bool,
  store: T.object.isRequired,
  children: T.any
}

export {
  Main
}
