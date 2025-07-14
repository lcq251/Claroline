import React, {useMemo} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl'
import {formatListField} from '#/main/app/content/form/parameters/utils'
import {selectors as securitySelectors} from '#/main/app/security'
import {actions as listActions} from '#/main/app/content/list'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {RegistrationUsers} from '#/plugin/cursus/registration/components/users'
import {getRegistrationActions, getRegistrationDefaultAction} from '#/plugin/cursus/session/utils'

const SessionUsers = (props) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(securitySelectors.currentUser)

  const refresher = useMemo(() => merge({
    add:    () => dispatch(listActions.invalidateData(props.name)),
    update: () => dispatch(listActions.invalidateData(props.name)),
    delete: () => dispatch(listActions.invalidateData(props.name))
  }, props.refresher || {}), [props.path])

  let customDefinition = [].concat(props.customDefinition || [])
  if (props.course && get(props.course, 'registration.form')) {
    get(props.course, 'registration.form').map(formSection => {
      customDefinition = customDefinition.concat(formSection.fields.map(field => formatListField(field, customDefinition, 'data')))
    })
  }

  customDefinition = customDefinition.concat([
    {
      name: 'confirmed',
      type: 'boolean',
      label: trans('confirmed'),
      displayable: get(props.session, 'registration.userValidation', false),
      displayed: get(props.session, 'registration.userValidation', false),
      filterable: get(props.session, 'registration.userValidation', false),
      sortable: get(props.session, 'registration.userValidation', false)
    }, {
      name: 'validated',
      type: 'boolean',
      label: trans('validated'),
      displayable: get(props.session, 'registration.validation', false),
      displayed: get(props.session, 'registration.validation', false),
      filterable: get(props.session, 'registration.validation', false),
      sortable: get(props.session, 'registration.validation', false)
    }
  ])

  return (
    <RegistrationUsers
      {...props}
      primaryAction={(row) => getRegistrationDefaultAction(row, refresher, props.path, currentUser)}
      actions={(rows) => getRegistrationActions(rows, refresher, props.path, currentUser)}
      customDefinition={customDefinition}
    />
  )
}

SessionUsers.propTypes = {
  path: T.string.isRequired,
  name: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  session: T.shape(
    SessionTypes.propTypes
  ),
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  }))
}

export {
  SessionUsers
}
