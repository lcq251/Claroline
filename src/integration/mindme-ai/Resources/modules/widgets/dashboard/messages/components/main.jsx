/*
 * dashboard-messages: recent platform messages / notifications.
 * Aligned with recommendation card visual style (shared block-head, card tokens).
 */

import React from 'react'
import { PropTypes as T } from 'prop-types'

import { trans } from '#/main/app/intl'
import {BlockHead} from '#/integration/mindme-ai/widgets/dashboard/common/block'

const PREFIX = 'mindme-ai-dashboard-messages-block'

const MessageItem = ({ item }) => (
  <a className={`${PREFIX}-item ${!item.read ? PREFIX + '-unread' : ''}`} href={item.url ?? '/message/' + item.id}>
    <div className={`${PREFIX}-item-header`}>
      <span className={`${PREFIX}-title`}>{item.title ?? trans('dashboard_messages_no_title', {}, 'widget')}</span>
      <span className={`${PREFIX}-date`}>{item.date ?? ''}</span>
    </div>
    {item.body && (
      <p className={`${PREFIX}-body`}>{item.body}</p>
    )}
  </a>
)

MessageItem.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string,
    body: T.string,
    date: T.string,
    read: T.bool,
    type: T.string,
    url: T.string
  }).isRequired,
}

function MessagesBlock(props) {
  const items = props.items ?? []
  const parameters = props.parameters || {}
  const data = parameters.data || {}
  const messages = data.messages ?? []
  
  // Build items from new data structure if available, otherwise use legacy items prop
  const displayItems = Array.isArray(messages) && messages.length > 0 
    ? messages 
    : (Array.isArray(items) ? items : [])
  
  const moreUrl = props.moreUrl ?? '/messages'

  if (displayItems.length === 0) {
    return (
      <section className={PREFIX} aria-label={trans('dashboard_messages_title', {}, 'widget')}>
        <BlockHead
          title={trans('dashboard_messages_title', {}, 'widget')}
          en="Messages"
          more={{ label: trans('dashboard_messages_see_all', {}, 'widget'), url: moreUrl }}
        />
        <div className={`${PREFIX}-empty`}>
          <p>{trans('dashboard_messages_empty', {}, 'widget')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={PREFIX} aria-label={trans('dashboard_messages_title', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_messages_title', {}, 'widget')}
        en="Messages"
        more={{ label: trans('dashboard_messages_see_all', {}, 'widget'), url: moreUrl }}
      />
      <ul className={`${PREFIX}-list`}>
        {displayItems.map(item => (
          <li key={item.id}>
            <MessageItem item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}

MessagesBlock.propTypes = {
  items: T.arrayOf(T.shape({
    id: T.string.isRequired,
    title: T.string,
    body: T.string,
    date: T.string,
    read: T.bool,
    type: T.string,
    url: T.string
  })),
  parameters: T.shape({
    data: T.shape({
      messages: T.arrayOf(T.shape({
        id: T.string,
        title: T.string,
        body: T.string,
        date: T.string,
        read: T.bool,
        type: T.string,
        url: T.string
      }))
    })
  }),
  moreUrl: T.string,
}

export { MessagesBlock }
