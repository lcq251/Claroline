import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {PageListSection} from '#/main/app/page'
import {ToolPage} from '#/main/core/tool'
import {Dot} from '#/main/app/components/dot'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {constants as listConst} from '#/main/app/content/list'

import {MessageDate} from '#/plugin/message/components/date'
import {MessageCard} from '#/plugin/message/data/components/message-card'
import {actions, selectors} from '#/plugin/message/tools/messaging/store'
import {MODAL_MESSAGE} from '#/plugin/message/modals/message'

const MessageInboxComponent = (props) =>
  <ToolPage
    title={trans('messages_received', {}, 'message')}
  >
    <PageListSection>
      <ListData
        flush={true}
        name={`${selectors.STORE_NAME}.receivedMessages`}
        fetch={{
          url: ['apiv2_message_received'],
          autoload: true
        }}
        addAction={{
          name: 'send',
          type: MODAL_BUTTON,
          //icon: 'fa fa-fw fa-plus',
          label: trans('send-message', {}, 'actions'),
          modal: [MODAL_MESSAGE],
          primary: true
        }}
        primaryAction={(message) => ({
          type: LINK_BUTTON,
          target: props.path+'/message/'+message.id,
          label: trans('open', {}, 'actions')
        })}
        definition={[
          {
            name: 'from',
            type: 'user',
            label: trans('message_from', {}, 'message'),
            displayed: true,
            filterable: true,
            sortable: false
          }, {
            name: 'object',
            type: 'string',
            label: trans('object', {}, 'message'),
            displayed: true,
            filterable: false,
            primary: true,
            render: (row) => (
              <div className="d-flex flex-direction-row gap-3 align-items-center text-truncate" role="presentation">
                {!row.meta.read &&
                  <Dot variant="primary" />
                }

                <b className={classes('d-inline-block', {
                  //'text-body': row.meta.read,
                  'fw-semibold': !row.meta.read,
                  'fw-normal': row.meta.read
                })}>{row.object || trans('no_object', {}, 'message')}</b>
              </div>
            )
          }, {
            name: 'content',
            type: 'html',
            label: trans('message'),
            filterable: false,
            sortable: false
          }, {
            name: 'meta.date',
            alias: 'date',
            type: 'date',
            label: trans('date'),
            displayed: true,
            render: (row) => <MessageDate value={row.meta.date} />,
            options: {
              time: true
            }
          }, {
            name: 'meta.read',
            alias: 'read',
            type: 'boolean',
            label: trans('message_read', {}, 'message')
          }
        ]}
        actions={(rows) => [
          {
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-envelope-open',
            label: trans('marked_read_message', {}, 'message'),
            displayed: -1 !== rows.findIndex(message => !message.meta.read),
            callback: () => props.readMessages(rows)
          }, {
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-envelope',
            label: trans('marked_unread_message', {}, 'message'),
            displayed: -1 !== rows.findIndex(message => message.meta.read),
            callback: () => props.unreadMessages(rows)
          }, {
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-trash',
            label: trans('delete', {}, 'actions'),
            dangerous: true,
            confirm: {
              title: trans('messages_delete_title', {}, 'message'),
              message: trans('messages_delete_confirm', {}, 'message')
            },
            callback: () => props.removeMessages(rows)
          }
        ]}
        card={MessageCard}
        display={{current: listConst.DISPLAY_LIST_SM}}
      />
    </PageListSection>
  </ToolPage>

MessageInboxComponent.propTypes = {
  path: T.string.isRequired,
  removeMessages: T.func.isRequired,
  unreadMessages: T.func.isRequired,
  readMessages: T.func.isRequired
}

const MessageInbox = connect(
  (state) => ({
    path: toolSelectors.path(state)
  }),
  (dispatch) => ({
    removeMessages(message) {
      dispatch(actions.removeMessages(message, `${selectors.STORE_NAME}.receivedMessages`))
    },
    readMessages(messages) {
      dispatch(actions.readMessages(messages))
    },
    unreadMessages(messages) {
      dispatch(actions.unreadMessages(messages))
    }
  })
)(MessageInboxComponent)

export {
  MessageInbox
}
