import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl/translation'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {constants} from '#/plugin/cursus/constants'
import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'

const SessionFormModal = props => {
  let formData
  if (props.session) {
    formData = props.session
  } else {
    formData = merge(
      {
        course: {
          id: props.course.id,
          name: props.course.name,
          code: props.course.code,
          slug: props.course.slug
        }
      }, SessionTypes.defaultProps, omit(props.course, 'id', 'description')
    )
  }

  return (
    <FormModal
      {...omit(props, 'session', 'course')}
      name="trainingSessionForm"
      title={trans(!props.session ? 'new_session' : 'session', {}, 'cursus')}
      subtitle={!props.session ? trans('new_session_desc', {course: props.course.name}, 'cursus') : undefined}
      target={!props.session ?
        ['apiv2_cursus_session_create'] :
        ['apiv2_cursus_session_update', {id: props.session.id}]
      }
      isNew={!props.session}
      data={formData}
      saveLabel={trans(!props.session ? 'plan_training_session' : 'save_training_session', {}, 'actions')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'code',
              type: 'string',
              label: trans('code'),
              required: true
            }, {
              name: 'dates',
              type: 'date-range',
              label: trans('training_period', {}, 'cursus'),
              required: true
            }
          ]
        }, {
          icon: 'fa fa-fw fa-circle-info',
          title: trans('information'),
          fields: [
            {
              name: 'description',
              type: 'html',
              label: trans('description')
            }, {
              name: 'location',
              type: 'location',
              label: trans('location'),
              options: {multiple: false}
            }, {
              name: 'restrictions.users',
              type: 'number',
              label: trans('available_seats', {}, 'cursus'),
              options: {
                min: 0
              }
            }, {
              name: 'pricing.price',
              label: trans('price'),
              type: 'currency',
              linked: [
                {
                  name: 'pricing.description',
                  label: trans('comment'),
                  type: 'string',
                  options: {
                    long: true
                  }
                }
              ]
            }
          ]
        }, {
          icon: 'fa fa-fw fa-desktop',
          title: trans('display_parameters'),
          fields: [
            {
              name: 'restrictions.hidden',
              type: 'boolean',
              label: trans('restrict_hidden'),
              help: trans('restrict_hidden_help')
            }
          ]
        }, {
          icon: 'fa fa-fw fa-sign-in',
          title: trans('registration'),
          fields: [
            {
              name: 'registration.eventRegistrationType',
              type: 'choice',
              label: trans('session_event_registration', {}, 'cursus'),
              required: true,
              options: {
                multiple: false,
                choices: constants.REGISTRATION_TYPES
              }
            }
          ]
        }, {
          icon: 'fa fa-fw fa-book',
          title: trans('workspace', {}, 'workspace'),
          displayed: (session) => get(session, 'workspace', null),
          fields: [
            {
              name: 'workspace',
              type: 'workspace',
              label: trans('workspace'),
              disabled: true,
              required: true
            }, {
              name: 'registration.tutorRole',
              type: 'role',
              label: trans('tutor_role', {}, 'cursus'),
              disabled: true,
              required: true
            }, {
              name: 'registration.learnerRole',
              type: 'role',
              label: trans('learner_role', {}, 'cursus'),
              disabled: true,
              required: true
            }
          ]
        }
      ]}
    />
  )
}

SessionFormModal.propTypes = {
  session: T.shape(
    SessionTypes.propTypes
  ),
  course: T.shape(
    CourseTypes.propTypes
  ),
  onSave: T.func
}

export {
  SessionFormModal
}
