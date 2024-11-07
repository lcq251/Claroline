import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {MODAL_USERS} from '#/main/community/modals/users'

import {constants} from '#/plugin/agenda/events/event/constants'
import {selectors} from '#/plugin/agenda/events/event/store'
import {PageSection} from '#/main/app/page'

const EventParticipants = (props) =>
  <PageSection
    title={trans('participants')}
  >
    <ListData
      name={selectors.LIST_NAME}
      fetch={{
        url: ['apiv2_event_list_participants', {id: props.eventId}],
        autoload: true
      }}
      delete={{
        url: ['apiv2_event_remove_participants', {id: props.eventId}],
        displayed: () => props.canEdit
      }}
      addAction={{
        name: 'add',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_participants', {}, 'actions'),
        displayed: props.canEdit,
        tooltip: 'bottom',
        modal: [MODAL_USERS, {
          selectAction: (users) => ({
            type: CALLBACK_BUTTON,
            label: trans('add', {}, 'actions'),
            callback: () => props.addParticipants(props.eventId, users)
          })
        }]
      }}
      definition={[
        {
          name: 'user',
          type: 'user',
          label: trans('user'),
          displayed: true
        }, {
          name: 'status',
          type: 'choice',
          label: trans('status'),
          options: {
            choices: constants.EVENT_STATUSES
          },
          displayed: true
        }
      ]}
      actions={(rows) => [
        {
          name: 'send-invitation',
          type: CALLBACK_BUTTON,
          icon: 'fa fa-fw fa-paper-plane',
          label: trans('send_invitation', {}, 'actions'),
          callback: () => props.sendInvitations(props.eventId, rows.map((participant) => participant.user)),
          displayed: props.canEdit,
          scope: ['object', 'collection']
        }
      ]}
    />
  </PageSection>

EventParticipants.propTypes = {
  canEdit: T.bool.isRequired,
  eventId: T.string.isRequired,

  addParticipants: T.func.isRequired,
  sendInvitations: T.func.isRequired
}


export {
  EventParticipants
}
