import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {constants as listConst} from '#/main/app/content/list/constants'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {ListData} from '#/main/app/content/list/containers/data'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {Forum as ForumType, Subject as SubjectType} from '#/plugin/forum/resources/forum/prop-types'
import {selectors} from '#/plugin/forum/resources/forum/store'
import {actions} from '#/plugin/forum/resources/forum/store'
import {SubjectCard} from '#/plugin/forum/data/components/subject-card'
import {MODAL_SUBJECT} from '#/plugin/forum/resources/forum/modals/subject'
import {hasPermission} from '#/main/app/security'

const SubjectsList = (props) =>
  <ListData
    className={props.className}
    name={`${selectors.STORE_NAME}.subjects.list`}
    fetch={{
      url: ['apiv2_forum_list_subjects', {id: get(props.forum, 'id')}],
      autoload: !!get(props.forum, 'id')
    }}
    delete={{
      url: ['apiv2_forum_subject_delete'],
      displayed: (rows) => -1 !== rows.findIndex(row => hasPermission('delete', row))
    }}
    primaryAction={(subject) => ({
      type: LINK_BUTTON,
      target: `${props.path}/subjects/${subject.id}`,
      label: trans('open', {}, 'actions')
    })}
    display={{
      current: listConst.DISPLAY_LIST,
      available: [listConst.DISPLAY_LIST]
    }}
    definition={[
      {
        name: 'title',
        type: 'string',
        label: trans('title'),
        displayed: true,
        primary: true
      }, {
        name: 'meta.closed',
        alias: 'closed',
        type: 'boolean',
        label: trans('closed_subject', {}, 'forum'),
        displayed: true,
        //filterable true if we want them
        filterable: false
      }, {
        name: 'meta.sticky',
        alias: 'sticked',
        type: 'boolean',
        label: trans('stuck', {}, 'forum'),
        displayed: true,
        //filterable true if we want them
        filterable: false
      }, {
        name: 'meta.messages',
        type: 'number',
        label: trans('posts_count', {}, 'forum'),
        displayed: true,
        filterable: false,
        sortable: true
      }, {
        name: 'meta.updated',
        type: 'date',
        label: trans('last_modification'),
        alias: 'updatedAt',
        displayed: true,
        filterable: false,
        sortable: false,
        options: {
          time: true
        }
      }, {
        name: 'meta.creator',
        type: 'user',
        label: trans('creator'),
        displayed: true,
        filterable: true,
        alias: 'creator'
      }, {
        name: 'tags',
        type: 'tag',
        label: trans('tags'),
        displayable: false,
        filterable: true,
        sortable: false,
        options: {
          objectClass: 'Claroline\\ForumBundle\\Entity\\Subject'
        }
      }, {
        name: 'lastMessage',
        type: 'string',
        label: trans('last_message', {}, 'forum'),
        displayed: false,
        displayable: true,
        filterable: false,
        sortable: true
      }
    ]}
    actions={(rows) => [
      {
        name: 'edit',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit', {}, 'actions'),
        scope: ['object'],
        modal: [MODAL_SUBJECT, {
          subject: rows[0],
          forumId: get(props.forum, 'id')
        }],
        displayed: hasPermission('edit', rows[0])
      }, {
        name: 'pin',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-thumb-tack',
        label: trans('stick', {}, 'forum'),
        callback: () => props.stickSubject(rows[0]),
        displayed: !rows[0].meta.sticky && hasPermission('follow', props.resourceNode)
      }, {
        name: 'unpin',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-thumb-tack',
        label: trans('unstick', {}, 'forum'),
        callback: () => props.unStickSubject(rows[0]),
        displayed: rows[0].meta.sticky && hasPermission('follow', props.resourceNode)
      }, {
        name: 'flag',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-flag',
        label: trans('flag', {}, 'forum'),
        displayed: !rows[0].meta.flagged && !!props.currentUser,
        callback: () => props.flagSubject(rows[0]),
        scope: ['object']
      }, {
        name: 'unflag',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-flag',
        label: trans('unflag', {}, 'forum'),
        displayed: rows[0].meta.flagged && hasPermission('follow', props.resourceNode),
        callback: () => props.unFlagSubject(rows[0]),
        scope: ['object']
      }, {
        name: 'close',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-circle-xmark',
        label: trans('close_subject', {}, 'forum'),
        callback: () => props.closeSubject(rows[0]),
        displayed: -1 !== rows.findIndex(row => !row.meta.closed && hasPermission('edit', rows[0])),
        scope: ['object'],
        confirm: {
          message: trans('close_subject_confirm', {}, 'forum'),
          additional: trans('close_subject_confirm_additional', {}, 'forum')
        }
      }, {
        name: 'open',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-arrow-up-right-from-square',
        label: trans('open_subject', {}, 'forum'),
        callback: () => props.unCloseSubject(rows[0]),
        displayed: -1 !== rows.findIndex(row => row.meta.closed && hasPermission('edit', rows[0])),
        scope: ['object'],
        confirm: {
          message: trans('open_subject_confirm', {}, 'forum'),
          additional: trans('open_subject_confirm_additional', {}, 'forum')
        }
      }
    ]}
    card={SubjectCard}
  />

SubjectsList.propTypes = {
  className: T.string,
  path: T.string.isRequired,
  resourceNode: T.object,
  currentUser: T.object,
  forum: T.shape(ForumType.propTypes),
  subject: T.shape(SubjectType.propTypes),
  stickSubject: T.func.isRequired,
  unStickSubject: T.func.isRequired,
  closeSubject: T.func.isRequired,
  unCloseSubject: T.func.isRequired,
  flagSubject: T.func.isRequired,
  unFlagSubject: T.func.isRequired
}

const Subjects = connect(
  state => ({
    path: resourceSelectors.path(state),
    resourceNode: resourceSelectors.resourceNode(state),
    currentUser: securitySelectors.currentUser(state),
    forum: selectors.forum(state),
    subject: selectors.subject(state)
  }),
  dispatch => ({
    stickSubject(subject) {
      dispatch(actions.stickSubject(subject))
    },
    unStickSubject(subject) {
      dispatch(actions.unStickSubject(subject))
    },
    closeSubject(subject) {
      dispatch(actions.closeSubject(subject))
    },
    unCloseSubject(subject) {
      dispatch(actions.unCloseSubject(subject))
    },
    flagSubject(subject) {
      dispatch(actions.flagSubject(subject))
    },
    unFlagSubject(subject) {
      dispatch(actions.unFlagSubject(subject))
    }
  })
)(SubjectsList)

export {
  Subjects
}
