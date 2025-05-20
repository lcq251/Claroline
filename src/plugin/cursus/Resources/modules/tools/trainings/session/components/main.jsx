import React, {useCallback} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {Routes} from '#/main/app/router/components/routes'

import {selectors as toolSelectors} from '#/main/core/tool'

import {TrainingsSessionList} from '#/plugin/cursus/tools/trainings/session/components/list'
import {SessionShow} from '#/plugin/cursus/session/containers/show'
import {TrainingsSessionUsers} from '#/plugin/cursus/tools/trainings/session/components/users'
import {constants} from '#/plugin/cursus/constants'
import {selectors} from '#/plugin/cursus/tools/trainings/session/store'
import {trans} from '#/main/app/intl'

const SessionMain = (props) => {
  const contextType = useSelector(toolSelectors.contextType)
  const contextId = useSelector(toolSelectors.contextId)
  const canRegister = useSelector(state => toolSelectors.hasPermission('register', state))
  const canCreateSession = useSelector(state => toolSelectors.hasPermission('edit', state))

  return (
    <Routes
      path={`${props.path}/sessions`}
      routes={[
        {
          path: '/',
          exact: true,
          render: useCallback(() => (
            <TrainingsSessionList
              path={props.path}
              contextType={contextType}
              contextId={contextId}
              invalidateList={props.invalidateList}
              canCreateSession={canCreateSession}
            />
          ), [props.path])
        }, {
          path: '/participants',
          render: useCallback(() => (
            <TrainingsSessionUsers
              path={props.path}
              contextType={contextType}
              contextId={contextId}
              title={trans('participants')}
              type={constants.LEARNER_TYPE}
              name={selectors.STORE_NAME+'.participants'}
              canRegister={canRegister}
            />
          ), [props.path])
        }, {
          path: '/tutors',
          render: useCallback(() => (
            <TrainingsSessionUsers
              path={props.path}
              contextType={contextType}
              contextId={contextId}
              title={trans('tutors', {}, 'cursus')}
              type={constants.TEACHER_TYPE}
              name={selectors.STORE_NAME+'.tutors'}
              canRegister={canRegister}
            />
          ), [props.path])
        }, {
          path: '/:id',
          render: useCallback((routerProps) => (
            <SessionShow path={props.path} id={routerProps.match.params.id} />
          ), [props.path])
        }
      ]}
    />
  )
}

SessionMain.propTypes = {
  path: T.string.isRequired,
  invalidateList: T.func.isRequired
}

export {
  SessionMain
}
