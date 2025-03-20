import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConstants} from '#/main/app/content/list/constants'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {actions as listActions} from '#/main/app/content/list/store'

import {getActions, getDefaultAction} from '#/plugin/open-badge/assertion/utils'

const Assertions = (props) => {
  const refresher = merge({
    add:    () => props.invalidate(props.name),
    update: () => props.invalidate(props.name),
    delete: () => props.invalidate(props.name)
  }, props.refresher || {})

  return (
    <ListData
      primaryAction={(row) => getDefaultAction(row, refresher, props.path, props.currentUser)}
      actions={(rows) => getActions(rows, refresher, props.path, props.currentUser)}
      definition={props.customDefinition || []}
      display={{current: listConstants.DISPLAY_LIST}}

      {...omit(props, 'path', 'url', 'customDefinition', 'refresher', 'invalidate')}

      name={props.name}
      fetch={{
        url: props.url,
        autoload: true
      }}
    />
  )
}

Assertions.propTypes = {
  path: T.string,
  name: T.string.isRequired,
  autoload: T.bool,
  url: T.oneOfType([T.string, T.array]).isRequired,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  })),
  invalidate: T.func.isRequired,
  currentUser: T.object,
  refresher: T.object,
  card: T.element
}

const AssertionList = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state)
  }),
  (dispatch) => ({
    invalidate(name) {
      dispatch(listActions.invalidateData(name))
    }
  })
)(Assertions)

export {
  AssertionList
}
