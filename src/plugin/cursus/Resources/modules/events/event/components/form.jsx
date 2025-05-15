import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {EventForm as BaseEventForm} from '#/plugin/agenda/event/containers/form'

import {constants} from '#/plugin/cursus/constants'

const EventForm = (props) =>
  <BaseEventForm
    flush={props.flush}
    name={props.name}
    target={(event, isNew) => isNew ? ['apiv2_cursus_event_create'] : ['apiv2_cursus_event_update', {id: event.id}]}
    onSave={props.onSave}
  >
    <FormData
      {...props}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'name',
              type: 'string',
              label: trans('name'),
              required: true
            }, {
              name: 'code',
              type: 'string',
              label: trans('code'),
              required: true
            }, {
              name: 'dates',
              type: 'date-range',
              label: trans('date'),
              required: true,
              calculated: (event) => [event.start || null, event.end || null],
              onChange: (datesRange) => {
                props.update('start', datesRange[0])
                props.update('end', datesRange[1])
              },
              options: {
                time: true
              }
            }
          ]
        }, {
          icon: 'fa fa-fw fa-circle-info',
          title: trans('information'),
          fields: [
            {
              name: 'session',
              label: trans('session', {}, 'cursus'),
              type: 'training_session',
              required: true,
              disabled: (data) => !isEmpty(data.session)
            }, {
              name: 'description',
              type: 'html',
              label: trans('description')
            }
          ]
        }, {
          icon: 'fa fa-fw fa-map-marker-alt',
          title: trans('location'),
          fields: [
            {
              name: '_locationType',
              type: 'choice',
              label: trans('type'),
              hideLabel: true,
              calculated: (event) => {
                if (event.location || 'irl' === event._locationType) {
                  return 'irl'
                }

                return 'online'
              },
              onChange: (value) => {
                if ('irl' === value) {
                  props.update('locationUrl', null)
                } else {
                  props.update('location', null)
                }
              },
              options: {
                choices: {
                  online: trans('online'),
                  irl: trans('irl')
                }
              },
              linked: [
                {
                  name: 'locationUrl',
                  label: trans('url'),
                  type: 'url',
                  displayed: (event) => event.locationUrl || !event._locationType || 'online' === event._locationType
                }, {
                  name: 'location',
                  label: trans('location'),
                  type: 'location',
                  displayed: (event) => event.location || 'irl' === event._locationType,
                  options: {multiple: false}
                }
              ]
            }
          ]
        }, {
          icon: 'fa fa-fw fa-desktop',
          title: trans('display_parameters'),
          fields: [
            {
              name: 'poster',
              type: 'image',
              label: trans('poster')
            }, {
              name: 'thumbnail',
              type: 'image',
              label: trans('thumbnail')
            }, {
              name: 'display.color',
              type: 'color',
              label: trans('color')
            }, {
              name: 'presenceTemplate',
              type: 'template',
              label: trans('training_event_presence', {}, 'template'),
              options: {
                templateType: 'training_event_presence'
              }
            }
          ]
        }, {
          icon: 'fa fa-fw fa-sign-in',
          title: trans('registration'),
          fields: [
            {
              name: 'registration.registrationType',
              type: 'choice',
              label: trans('session_event_registration', {}, 'cursus'),
              required: true,
              options: {
                multiple: false,
                choices: constants.REGISTRATION_TYPES
              }
            }, {
              name: 'registration.mail',
              type: 'boolean',
              label: trans('registration_send_mail', {}, 'cursus'),
              linked: [
                {
                  name: 'invitationTemplate',
                  type: 'template',
                  label: trans('training_event_invitation', {}, 'template'),
                  displayed: (event) => event.registration ? event.registration.mail : false,
                  options: {
                    templateType: 'training_event_invitation'
                  }
                }
              ]
            }
          ]
        }, {
          icon: 'fa fa-fw fa-key',
          title: trans('restrictions'),
          fields: [
            {
              name: 'restrictions.users',
              type: 'number',
              label: trans('users_count'),
              options: {
                min: 0
              },
              displayed: (event) => event.registration && constants.REGISTRATION_AUTO !== event.registration.registrationType
            }
          ]
        }
      ]}
    />
  </BaseEventForm>

EventForm.propTypes = {
  flush: T.bool,
  name: T.string.isRequired,
  event: T.object,
  update: T.func.isRequired,
  onSave: T.func
}

export {
  EventForm
}
