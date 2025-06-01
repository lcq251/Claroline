import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConst} from '#/main/app/content/list/constants'
import {actions as listActions} from '#/main/app/content/list/store'
import {Modal} from '#/main/app/overlays'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {actions} from '#/plugin/forum/resources/forum/store'
import {selectors} from '#/plugin/forum/resources/forum/store'
import {MessageCard} from '#/plugin/forum/data/components/message-card'

const FlaggedModal = (props) => {
  const dispatch = useDispatch()

  const path = useSelector(resourceSelectors.path)
  const forum = useSelector(selectors.forum)

  return (
    <Modal
      {...props}
      icon="fa fa-fw fa-flag"
      title={trans('flagged_messages', {}, 'forum')}
      subtitle={trans('Lorem ipsum dolor sit amet')}
      size="xl"
    >
      <ListData
        name={`${selectors.STORE_NAME}.flaggedMessages`}
        className="border-top"
        flush={true}
        autoFocus={true}
        fetch={{
          url: ['apiv2_forum_message_flagged_list', {forum: get(forum, 'id')}],
          autoload: !!get(forum, 'id')
        }}
        delete={{
          url: ['apiv2_forum_message_delete']
        }}
        display={{
          current: listConst.DISPLAY_LIST
        }}
        definition={[
          {
            name: 'content',
            type: 'string',
            label: trans('message'),
            displayed: true,
            primary: true
          }, {
            name: 'subject.title',
            type: 'string',
            label: trans('subject', {}, 'forum'),
            displayed: true
          }, {
            name: 'meta.creator',
            type: 'user',
            label: trans('creator'),
            displayed: true
          }, {
            name: 'meta.updated',
            type: 'date',
            label: trans('last_modification'),
            displayed: true,
            option: {
              time: true
            }
          }
        ]}
        actions={(rows) => [
          {
            name: 'open',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-arrow-up-right-from-square',
            label: trans('see_message_context', {}, 'forum'),
            target: `${path}/subjects/${rows[0].subject.id}`,
            scope: ['object']
          }, {
            name: 'unreport',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-flag',
            label: trans('unflag', {}, 'forum'),
            callback: () => {
              dispatch(actions.unFlag(rows[0], rows[0].subject.id))
              dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.flaggedMessages`))
            }
          }
        ]}
        card={(props) => <MessageCard {...props} />}
      />
    </Modal>
  )
}

export {
  FlaggedModal
}
