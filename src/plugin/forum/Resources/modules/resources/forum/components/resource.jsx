import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Resource} from '#/main/core/resource'

import {Forum as ForumTypes} from '#/plugin/forum/resources/forum/prop-types'
import {ForumOverview} from '#/plugin/forum/resources/forum/components/overview'
import {ForumEditor} from '#/plugin/forum/resources/forum/editor/components/main'
import {ForumSubject} from '#/plugin/forum/resources/forum/components/subject'
import {MODAL_FORUM_FLAGGED} from '#/plugin/forum/resources/forum/modals/flagged'

const ForumResource = props =>
  <Resource
    {...omit(props)}
    styles={['claroline-distribution-plugin-forum-forum-resource']}
    actions={[
      {
        name: 'enable-notification',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-bell',
        label: trans('receive_notifications', {}, 'forum'),
        displayed: !props.notified,
        callback: () => props.notify(props.forum, props.currentUser)
      }, {
        name: 'disable-notification',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-bell-slash',
        label: trans('stop_receive_notifications', {}, 'forum'),
        displayed: props.notified,
        callback: () => props.stopNotify(props.forum, props.currentUser)
      }, {
        name: 'flagged-messages',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-flag',
        label: trans('show_flagged_messages', {}, 'actions'),
        group: trans('management'),
        displayed: props.moderator,
        modal: [MODAL_FORUM_FLAGGED]
      }
    ]}
    editor={ForumEditor}
    overviewPage={ForumOverview}
    pages={[
      {
        path: '/subjects/:id',
        component: ForumSubject,
        onEnter: (params) => props.openSubject(params.id)
      }
    ]}
  />

ForumResource.propTypes = {
  currentUser: T.object,
  forum: T.shape(ForumTypes.propTypes).isRequired,
  moderator: T.bool.isRequired,
  notified: T.bool.isRequired,
  notify: T.func.isRequired,
  stopNotify: T.func.isRequired,
  openSubject: T.func.isRequired
}

export {
  ForumResource
}
