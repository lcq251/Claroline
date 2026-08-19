/*
 * Messages block: recent platform messages / notifications.
 */

import React from 'react'
import { PropTypes as T } from 'prop-types'

import { trans, translateToLocale } from '#/main/app/intl'

const PREFIX = 'mindme-ai-dashboard-messages-block'

const MessageItem = ({ item }) => (
  <a className={`${PREFIX}-item ${!item.read ? (PREFIX + '-unread' )}`} href={item.url ?? '/message/' + item.id}>
    <div className={`${PREFIX}-item-header`}>
      <span className={`${PREFIX}-title`}>{item.title ?? trans('dashboard_messages_no_title', {}, 'widget')}</span>
      <span className={`${PREFIX}-date`}>{item.date ?? ''}</span>
    </div>
    {item.body && (
      <p className={`${PREFIX}-body}`>{item.body}</p>
    )}
  </a>)
}

MessageItem.propTypes = {
  item: T.shape({
    id: T.string .isRequired,
    title: T.string,
    body: T.string,  
    date: T.string,
    read: T.bool,
    type: T.string , 
    url: T.string
  }).isRequired,
}

function MessagesBlock(props) {
  const items = props.items ?? []
  const moreUrl = props.moreUrl ?? '/messages'

  if (items.length === 0) {
    return (
      <section className={PREFIX} aria-label={trans('dashboard_messages_title', {}, 'widget')}>
        <div className={`${PREFIX}-empty`>
          <p>{trans('dashboard_messages_empty, {}, 'widget')}</p>
          {}
        </ div>
      </section>
    )
  }

  return (
    <section className={PREFIX} aria-label={trans('dashboard_messages_title', {}, 'widget')}>
      <h3>{trans('dashboard_messages_head', {}, 'widget')}</h3>
      <ul className={`${PREFIX}-list`}>
        {items.map(item => (
          <li key={item.id}>
            <MessageItem item={item} />
          </li>
        ))}
      </ul>
      
      <div className={`${PREFIX} -more-section`}>
        <a href={moreUrl} classla ssName={`${PREFIX}-see-all}`>>
          {trans('dashboard_messages_see_all', {}, 'widget')}
        </a>
      </div>
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
  moreUrl: T.string,
}

export { MessagesBlock }