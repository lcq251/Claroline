import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {FormData} from '#/main/app/content/form/containers/data'

import {selectors} from '#/plugin/message/modals/message/store'

const MessageModal = props =>
  <Modal
    {...omit(props, 'message', 'receivers', 'saveEnabled', 'onSend', 'send', 'reset')}
    icon="fa fa-fw fa-paper-plane"
    title={trans('new_message', {}, 'message')}
    onEnter={() => props.reset(props.receivers)}
    size="lg"
  >
    <FormData
      flush={true}
      name={selectors.STORE_NAME}
      sections={[
        {
          id: 'general',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'receivers.users',
              type: 'user',
              label: trans('message_form_to', {}, 'message'),
              options: {multiple: true}
            }, {
              name: 'receivers.groups',
              type: 'group',
              label: trans('message_form_to', {}, 'message'),
              options: {
                multiple: true,
                // the only readOnly group is ROLE_USER which contains all the platform users
                // we don't want someone to be able to send a message to everyone
                picker: {filters: !props.isAdmin ? [{property: 'meta.readOnly', value: false, locked: true}] : []}
              }
            }, {
              name: 'receivers.workspaces',
              type: 'workspace',
              label: trans('message_form_to', {}, 'message'),
              options: {multiple: true}
            }, {
              name: 'object',
              type: 'string',
              label: trans('object')
            }, {
              name: 'content',
              type: 'html',
              label: trans('content'),
              required: true,
              options: {
                minRows: 5
              }
            }
          ]
        }
      ]}
    />

    <Button
      className="modal-btn"
      variant="btn"
      size="lg"
      type={CALLBACK_BUTTON}
      primary={true}
      label={trans('send', {}, 'actions')}
      disabled={!props.saveEnabled}
      callback={() => {
        props.send(props.onSend)
        props.fadeModal()
      }}
    />
  </Modal>

MessageModal.propTypes = {
  isAdmin: T.bool.isRequired,
  saveEnabled: T.bool.isRequired,
  receivers: T.shape({
    users: T.arrayOf(T.shape({
      // user types
    })),
    groups: T.arrayOf(T.shape({
      // group types
    })),
    workspaces: T.arrayOf(T.shape({
      // workspace types
    }))
  }),
  reset: T.func.isRequired,
  onSend: T.string,
  send: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  MessageModal
}