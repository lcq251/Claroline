import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useHistory} from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {Button} from '#/main/app/action'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {route} from '#/plugin/cursus/course/routing'
import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/parameters'

import {SessionDateCard} from '#/plugin/cursus/session/components/card'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

const CourseSessions = (props) => {
  const history = useHistory()

  return (
    <>
      {isEmpty(props.availableSessions) &&
        <ContentPlaceholder
          className="mt-4"
          title={trans('Aucune session n\'est disponible pour cette formation pour le moment.', {}, 'cursus')}
          help={trans('Lorem ipsum dolor sit amet', {}, 'cursus')}
        />
      }

      <div className="mt-4" role="presentation">
        {!isEmpty(props.availableSessions) && props.availableSessions.map(session => (
          <SessionDateCard
            key={session.id}
            orientation="row"
            size="sm"
            data={session}
            primaryAction={{
              type: LINK_BUTTON,
              target: route(props.course, session, props.path),
              label: trans('open', {}, 'actions')
            }}
          />
        ))}
      </div>

      {hasPermission('edit', props.course) &&
        <div className="d-flex mt-4" role="presentation">
          <Button
            className="btn btn-body"
            {...{
              type: MODAL_BUTTON,
              label: trans('plan_training_session', {}, 'actions'),
              modal: [MODAL_SESSION_FORM, {
                course: props.course,
                onSave: (newSession) => {
                  // open created session, but let user on sessions list to allow multiples creations
                  history.push(route(props.course, newSession, props.path) + '/sessions')
                  props.reload(props.course.slug)
                }
              }]
            }}
          />

          <Button
            className="btn btn-link ms-auto me-n3 me-n3"
            type={LINK_BUTTON}
            label={trans('Voir toutes les sessions')}
            target={props.path+'/sessions'}
          >
            <span className="ms-2 fa fa-arrow-right" aria-hidden={true} />
          </Button>
        </div>
      }
    </>
  )
}

CourseSessions.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  availableSessions: T.arrayOf(T.shape(
    SessionTypes.propTypes
  )),
  reload: T.func.isRequired
}

export {
  CourseSessions
}
