import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {actions as listActions} from '#/main/app/content/list/store'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {Subject as SubjectType} from '#/plugin/forum/resources/forum/prop-types'
import {selectors} from '#/plugin/forum/resources/forum/store'
import {actions} from '#/plugin/forum/resources/forum/store'
import {Button} from '#/main/app/action'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {UserMessage} from '#/main/core/user/message/components/user-message'


class MessageCommentsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showCommentForm: null,
      showNewCommentForm: null,
      opened: props.opened
    }
  }

  showCommentForm(messageId) {
    this.setState({opened: true})
    this.setState({showNewCommentForm: messageId})
  }

  createNewComment(messageId, comment) {
    this.props.createComment(messageId, comment)
    this.setState({showNewCommentForm: null})
  }

  updateComment(comment, content) {
    this.props.editContent(comment, this.props.subject.id, content)
    this.setState({showCommentForm: null})
  }

  render() {
    const visibleComments = this.props.message.children

    return (
      <div className="answer-comment-container mt-1" role="presentation">
        {!isEmpty(visibleComments) &&
          <ul className="list-unstyled mb-0">
            {visibleComments.map(comment =>
              <li key={comment.id} className="mt-3">
                {this.state.showCommentForm === comment.id ?
                  <UserMessageForm
                    user={this.props.currentUser}
                    allowHtml={true}
                    submitLabel={trans('edit', {}, 'actions')}
                    date={comment.meta.created}
                    content={comment.content}
                    submit={(content) => this.updateComment(comment, content)}
                    cancel={() => this.setState({showCommentForm: null})}
                  /> :
                  <UserMessage
                    user={comment.meta.creator}
                    date={comment.meta.created}
                    content={comment.content}
                    allowHtml={true}
                    actions={[
                      {
                        name: 'edit',
                        type: CALLBACK_BUTTON,
                        icon: 'fa fa-fw fa-pencil',
                        label: trans('edit', {}, 'actions'),
                        displayed: this.props.currentUser && (comment.meta.creator.id === this.props.currentUser.id) && !get(this.props.subject, 'meta.closed'),
                        callback: () => this.setState({showCommentForm: comment.id})
                      }, {
                        name: 'report',
                        type: CALLBACK_BUTTON,
                        icon: 'fa fa-fw fa-flag',
                        label: trans('flag', {}, 'forum'),
                        displayed: this.props.currentUser && (comment.meta.creator.id !== this.props.currentUser.id) && !comment.meta.flagged,
                        callback: () => this.props.flag(comment, this.props.subject.id)
                      }, {
                        name: 'unreport',
                        type: CALLBACK_BUTTON,
                        icon: 'fa fa-fw fa-flag',
                        label: trans('unflag', {}, 'forum'),
                        displayed: this.props.currentUser && (comment.meta.creator.id !== this.props.currentUser.id) && comment.meta.flagged,
                        callback: () => this.props.unFlag(comment, this.props.subject.id)
                      }, {
                        name: 'delete',
                        type: CALLBACK_BUTTON,
                        icon: 'fa fa-fw fa-trash',
                        label: trans('delete', {}, 'actions'),
                        displayed: this.props.currentUser && (comment.meta.creator.id === this.props.currentUser.id || this.props.moderator),
                        callback: () => this.props.deleteComment(comment.id),
                        dangerous: true,
                        confirm: trans('remove_comment_confirm_message', {}, 'forum')
                      }
                    ]}
                  />
                }
              </li>
            )}
          </ul>
        }

        {this.state.showNewCommentForm === this.props.message.id &&
          <UserMessageForm
            className="mt-2"
            user={this.props.currentUser}
            allowHtml={true}
            submitLabel={trans('reply', {}, 'actions')}
            submit={(comment) => this.createNewComment(this.props.message.id, comment)}
            cancel={() => this.setState({showNewCommentForm: null})}
          />
        }

        {!get(this.props.subject, 'meta.closed') && !this.state.showNewCommentForm &&
          <Button
            className="btn btn-link btn-sm"
            type={CALLBACK_BUTTON}
            label={trans('reply', {}, 'actions')}
            callback={() => this.showCommentForm(this.props.message.id)}
            size="sm"
          />
        }
      </div>
    )
  }
}

MessageCommentsComponent.propTypes = {
  currentUser: T.object,
  subject: T.shape(SubjectType.propTypes).isRequired,
  message: T.shape({
    id: T.string.isRequired,
    children: T.array.isRequired
  }).isRequired,
  editContent: T.func.isRequired,
  opened: T.bool,
  flag: T.func.isRequired,
  unFlag: T.func.isRequired,
  deleteComment: T.func.isRequired,
  createComment: T.func.isRequired,
  moderator: T.bool.isRequired
}

const MessageComments =  connect(
  state => ({
    currentUser: securitySelectors.currentUser(state),
    forum: selectors.forum(state),
    moderator: selectors.moderator(state)
  }),
  dispatch => ({
    createComment(messageId, comment) {
      dispatch(actions.createComment(messageId, comment))
    },
    deleteComment(id) {
      dispatch(listActions.deleteData('subjects.messages', ['apiv2_forum_message_delete'], [{id: id}]))
    },
    reload(id, forumId) {
      dispatch(listActions.fetchData('subjects.messages', ['apiv2_forum_subject_get_messages', {id: id}]))
    },
    editContent(message, subjectId, content) {
      dispatch(actions.editContent(message, subjectId, content))
    },
    flag(message, subjectId) {
      dispatch(actions.flag(message, subjectId))
    },
    unFlag(message, subjectId) {
      dispatch(actions.flag(message, subjectId))
    }
  })
)(MessageCommentsComponent)

export {
  MessageComments
}
