import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {param} from '#/main/app/config'
import {FormData} from '#/main/app/content/form/containers/data'

import {constants} from '#/plugin/cursus/constants'

const SessionForm = (props) =>
  <FormData
    {...props}
    sections={[
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
            name: 'restrictions.dates',
            type: 'date-range',
            label: trans('training_period', {}, 'cursus'),
            required: true
          }, {
            name: 'restrictions.users',
            type: 'number',
            label: trans('available_seats', {}, 'cursus'),
            options: {
              min: 0
            }
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
        title: trans('workspace'),
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
      }, {
        icon: 'fa fa-fw fa-credit-card',
        title: trans('pricing'),
        displayed: param('pricing.enabled'),
        fields: [
          {
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
      }
    ]}
  >
    {props.children}
  </FormData>

SessionForm.propTypes = {
  name: T.string.isRequired,
  children: T.any,
  update: T.func.isRequired
}

export {
  SessionForm
}
