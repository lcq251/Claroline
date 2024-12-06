import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {Resource} from '#/main/core/resource'

import {ForumOverview} from '#/plugin/forum/resources/forum/components/overview'
import {Moderation} from '#/plugin/forum/resources/forum/moderation/components/moderation'
import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {ForumEditor} from '#/plugin/forum/resources/forum/editor/components/main'
import {Subject} from '#/plugin/forum/resources/forum/player/components/subject'

const ForumResource = props =>
  <Resource
    {...omit(props)}
    styles={['claroline-distribution-plugin-forum-forum-resource']}
    actions={[
      {
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-bell',
        label: trans('receive_notifications', {}, 'forum'),
        displayed: !props.notified,
        callback: () => props.notify(props.forum, props.currentUser)
      }, {
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-bell',
        label: trans('stop_receive_notifications', {}, 'forum'),
        displayed: props.notified,
        callback: () => props.stopNotify(props.forum, props.currentUser)
      }, {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-flag',
        label: trans('flagged_messages', {}, 'forum'),
        group: trans('moderation', {}, 'forum'),
        displayed: props.moderator,
        target: `${props.path}/moderation/flagged/subjects`
      }
    ]}
    editor={ForumEditor}
    overviewPage={ForumOverview}
    pages={[
      {
        path: '/moderation',
        disabled: !props.moderator,
        render: () => {
          const component = <Moderation path={props.path} />

          return component
        }
      }, {
        path: '/subjects/form/:id?',
        component: Subject,
        onEnter: (params) => {
          if (params.id) {
            props.newSubject(params.id)
          } else {
            props.invalidateMessagesList(get(props.forum, 'display.messageOrder'))
            props.newSubject()
          }
        },
        onLeave: () => {
          props.closeSubjectForm()
          if (props.editingSubject){
            props.stopSubjectEdition()
          }
        }
      },{
        path: '/subjects/show/:id',
        component: Subject,
        onEnter: (params) => {
          props.invalidateMessagesList(get(props.forum, 'display.messageOrder'))
          props.openSubject(params.id)
        },
        onLeave: () => {
          if (props.showSubjectForm){
            props.closeSubjectForm()
          }
        }
      }
    ]}
    redirect={[
      {from: '/', to: '/subjects', exact: true, disabled: !!get(props.forum, 'display.showOverview')}
    ]}
  />

ForumResource.propTypes = {
  path: T.string.isRequired,
  currentUser: T.object,
  forum: T.shape(ForumType.propTypes).isRequired,
  moderator: T.bool.isRequired,
  editable: T.bool.isRequired,
  loadLastMessages: T.func.isRequired,
  notified: T.bool.isRequired,
  notify: T.func.isRequired,
  stopNotify: T.func.isRequired,
  newSubject: T.func.isRequired,
  closeSubjectForm: T.func.isRequired,
  stopSubjectEdition: T.func.isRequired,
  openSubject: T.func.isRequired,
  showSubjectForm: T.bool.isRequired,
  editingSubject: T.bool.isRequired,
  loadSubjectList: T.func.isRequired,
  loadSubjectForm: T.func,
  invalidateMessagesList: T.func
}

export {
  ForumResource
}
