/*
 * dashboard-notifications widget (C-22): notification list.
 *
 * data.messages[] is injected by the backend serializer (Notification bundle);
 * the widget renders at most `maxItems` rows with unread state and
 * locale-relative timestamps. Empty list keeps the block head and shows a
 * "no data" row (spec §3.6).
 */

import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

import {BlockHead} from '../common/block'
import {getIcon} from '../common/icons'
import {relativeTime} from '../common/time'

const PREFIX = 'claroline-distribution-integration-mindme-ai-dashboard-dashboard-notifications'

const NotificationItem = props => {
  const msg = props.msg || {}
  const icon = getIcon(`msg-${msg.type || 'other'}`)
  const time = relativeTime(msg.time)

  const row = (
    <div className={msg.unread ? 'msg-item is-unread' : 'msg-item'}>
      <span className="msg-dot" aria-hidden="true"><i className={`fas ${icon}`} /></span>

      <div className="msg-body">
        <div className="msg-title">
          {msg.unread &&
            <span className="sr-only">{trans('dashboard_unread', {}, 'widget')}</span>
          }
          <span>{msg.title}</span>
        </div>
        {props.showDescription && msg.description &&
          <div className="msg-desc">{msg.description}</div>
        }
      </div>

      {time &&
        <span className="msg-time">{time}</span>
      }
    </div>
  )

  // whole row clickable through a real <a> overlay when a target exists
  if (msg.url) {
    return <a className="msg-item-link" href={msg.url}>{row}</a>
  }

  return row
}

NotificationItem.propTypes = {
  msg: T.shape({
    title: T.string,
    description: T.string,
    type: T.string,
    unread: T.bool,
    time: T.string,
    url: T.string
  }),
  showDescription: T.bool
}

const NotificationsComponent = props => {
  const parameters = props.parameters || {}
  const data = parameters.data || {}
  const messages = Array.isArray(data.messages) ? data.messages : []
  const maxItems = parameters.maxItems || 3
  const showDescription = parameters.showDescription !== false
  const list = messages.slice(0, maxItems)

  return (
    <section className={PREFIX} aria-label={trans('dashboard_block_notifications', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_block_notifications', {}, 'widget')}
        en="Notifications"
        more={{label: trans('dashboard_more_notifications', {}, 'widget'), url: '#/desktop'}}
      />

      <div className="msg-card">
        {0 === list.length
          ? <div className="empty-row">{trans('dashboard_metric_na_title', {}, 'widget')}</div>
          : list.map((msg, index) => (
            <NotificationItem key={msg.id || index} msg={msg} showDescription={showDescription} />
          ))
        }
      </div>
    </section>
  )
}

NotificationsComponent.propTypes = {
  parameters: T.shape({
    maxItems: T.number,
    showDescription: T.bool,
    data: T.shape({
      messages: T.arrayOf(T.object)
    })
  })
}

const Notifications = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(NotificationsComponent)

export {
  Notifications
}
