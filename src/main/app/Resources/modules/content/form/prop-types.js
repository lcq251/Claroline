import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {DataProperty} from '#/main/app/data/types/prop-types'
import {Action, PromisedAction} from '#/main/app/action/prop-types'

const DataFormProperty = {
  propTypes: merge({}, DataProperty.propTypes, {
    // form configuration
    help: T.oneOfType([T.string, T.arrayOf(T.string)]),
    hideLabel: T.bool,
    displayed: T.oneOfType([
      T.bool,
      T.func // a function that receives the whole form data and returns a bool
    ]),
    required: T.bool,
    disabled: T.oneOfType([
      T.bool,
      T.func // a function that receives the whole form data and returns a bool
    ]),
    autoFocus: T.bool,

    // field methods
    onChange: T.func,
    validate: T.func
  }),
  defaultProps: merge({}, DataProperty.defaultProps, {
    required: false,
    hideLabel: false,
    disabled: false,
    displayed: true
  })
}

const DataFormSection = {
  propTypes: {
    id: T.string,
    icon: T.string,
    title: T.string.isRequired,
    description: T.string,
    help: T.string,
    primary: T.bool,
    displayed: T.oneOfType([T.bool, T.func]),
    disabled: T.oneOfType([T.bool, T.func]),
    defaultOpened: T.bool,
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
    fields: T.arrayOf(T.shape(
      merge({}, DataFormProperty.propTypes, {
        // children
        linked: T.arrayOf(T.shape(
          DataFormProperty.propTypes
        ))
      })
    )),
    component: T.oneOfType([T.func, T.object]),
    render: T.func
  },
  defaultProps: {
    primary: false,
    displayed: true,
    defaultOpened: false,
    fields: []
  }
}

export {
  DataFormSection,
  DataFormProperty
}
