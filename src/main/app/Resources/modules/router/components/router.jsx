import React from 'react'
import {PropTypes as T} from 'prop-types'
import {
  HashRouter,
  MemoryRouter
} from 'react-router-dom'

const Router = ({ children, basename, embedded = false }) => {
  if (!embedded) {
    return (
      <HashRouter basename={basename}>
        {children}
      </HashRouter>
    )
  }

  return (
    <MemoryRouter
      initialEntries={basename ? [
        basename
      ] : undefined}
      initialIndex={basename ? 0 : undefined}
    >
      {children}
    </MemoryRouter>
  )
}

Router.propTypes = {
  basename: T.string,
  children: T.node.isRequired,
  embedded: T.bool
}

export {
  Router
}
