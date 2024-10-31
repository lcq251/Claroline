import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ContextHistory} from '#/main/app/context/components/history'

const SearchRecent = (props) =>
  <ContextHistory
    className="mt-3"
    onOpen={props.fadeModal}
  />

SearchRecent.propTypes = {
  fadeModal: T.func.isRequired
}

export {
  SearchRecent
}
