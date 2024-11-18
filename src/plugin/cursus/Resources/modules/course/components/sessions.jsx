import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useHistory} from 'react-router-dom'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {route as workspaceRoute} from '#/main/core/workspace/routing'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {route} from '#/plugin/cursus/course/routing'
import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/parameters'
import {SessionList} from '#/plugin/cursus/session/components/list'
import {selectors} from '#/plugin/cursus/course/store'
import {getInfo, isRegistered, isFull, canSelfRegister} from '#/plugin/cursus/utils'
import {MODAL_COURSE_REGISTRATION} from '#/plugin/cursus/course/modals/registration'
import {Button} from '#/main/app/action'
import {SessionDateCard} from '#/plugin/cursus/session/components/card'

const CourseSessions = (props) => {
  const history = useHistory()

  return (
    <>
      <SessionList
        className={props.className}
        path={props.basePath}
        name={selectors.STORE_NAME+'.courseSessions'}
        url={['apiv2_cursus_course_list_sessions', {id: props.course.id}]}
        addAction={{
          type: MODAL_BUTTON,
          label: trans('plan_training_session', {}, 'actions'),
          icon: 'fa fa-fw fa-plus',
          tooltip: 'bottom',
          modal: [MODAL_SESSION_FORM, {
            course: props.course,
            onSave: (newSession) => {
              // open created session, but let user on sessions list to allow multiples creations
              history.push(route(props.course, newSession, props.basePath) + '/sessions')
              props.reload(props.course.slug)
            }
          }],
          displayed: hasPermission('edit', props.course)
        }}
        delete={{
          url: ['apiv2_cursus_session_delete'],
          displayed: (rows) => -1 !== rows.findIndex(row => hasPermission('delete', row))
        }}
        customActions={(rows) => [
          {
            name: 'open-workspace',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-arrow-circle-right',
            label: trans('open-training', {}, 'actions'),
            displayed: !isEmpty(getInfo(props.course, rows[0], 'workspace')) && (hasPermission('edit', rows[0]) || getInfo(props.course, rows[0], 'registration.autoRegistration') || isRegistered(rows[0], props.registrations)),
            callback: () => {
              const workspaceUrl = workspaceRoute(getInfo(props.course, rows[0], 'workspace'))
              if (get(rows[0], 'registration.autoRegistration') && !isRegistered(rows[0], props.registrations)) {
                props.register(props.course, rows[0].id).then(() => history.push(workspaceUrl))
              } else {
                history.push(workspaceUrl)
              }
            },
            scope: ['object'],
            primary: true
          }, {
            name: 'edit',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            modal: [MODAL_SESSION_FORM, {
              session: rows[0],
              onSave: () => props.reload(props.course.slug)
            }],
            scope: ['object'],
            displayed: hasPermission('edit', rows[0]),
            group: trans('management')
          }, {
            name: 'self-register',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-user-plus',
            label: trans(isFull(rows[0]) ? 'register_waiting_list' : 'self_register', {}, 'actions'),
            displayed: canSelfRegister(props.course, rows[0], props.registrations),
            modal: [MODAL_COURSE_REGISTRATION, {
              path: props.path,
              course: props.course,
              session: rows[0],
              register: props.register
            }],
            tooltip: null,
            scope: ['object']
          }
        ]}
        card={SessionDateCard}
      />

      <Button
        className="btn btn-link mt-4 ms-auto"
        type={CALLBACK_BUTTON}
        label={trans('Voir toutes les sessions')}
        callback={() => true}
      >
        <span className="ms-2 fa fa-arrow-right" aria-hidden={true} />
      </Button>
    </>
  )
}

CourseSessions.propTypes = {
  path: T.string.isRequired,
  basePath: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  registrations: T.shape({
    users: T.array,
    groups: T.array
  }),
  contextType: T.string.isRequired,
  reload: T.func.isRequired,
  register: T.func.isRequired
}

export {
  CourseSessions
}
