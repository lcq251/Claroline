import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {withRouter} from '#/main/app/router'
import {trans, transChoice} from '#/main/app/intl/translation'
import {asset} from '#/main/app/config/asset'
import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'
import {withModal} from '#/main/app/overlays/modal/withModal'
import {
  actions as listActions,
  select as listSelect
} from '#/main/app/content/list/store'
import {selectors as formSelect} from '#/main/app/content/form/store'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {selectors as resourceSelectors} from '#/main/core/resource/store'
import {UserMessage} from '#/main/core/user/message/components/user-message'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'

import {Subject as SubjectType} from '#/plugin/forum/resources/forum/prop-types'
import {selectors} from '#/plugin/forum/resources/forum/store'
import {actions} from '#/plugin/forum/resources/forum/store'
import {MessageComments} from '#/plugin/forum/resources/forum/player/components/message-comments'
import {SubjectForm} from '#/plugin/forum/resources/forum/player/components/subject-form'
import {ResourcePage} from '#/main/core/resource'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {getActions} from '#/main/community/group/utils'
import {PageHeading} from '#/main/app/page/components/heading'
import {Content} from '#/main/app/components/content'
import {UserMicro} from '#/main/core/user/components/micro'
import {Datetime} from '#/main/app/components/date'
import {PageSection} from '#/main/app/page'
import {Badge} from '#/main/app/components/badge'

class SubjectComponent extends Component {
  constructor(props) {
    super(props)

    if (this.props.invalidated || !this.props.loaded) {
      this.props.reload(this.props.subject.id, this.props.forum.id)
    }
    this.state = {
      showMessageForm: null
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.invalidated !== this.props.invalidated && this.props.invalidated)
    || (prevProps.loaded !== this.props.loaded && !this.props.loaded)) {
      this.props.reload(this.props.subject.id, this.props.forum.id)
    }
  }

  editSubject(subjectId) {
    this.props.subjectEdition()
    this.props.history.push(`${this.props.path}/subjects/form/${subjectId}`)
  }

  createMessage(subjectId, content) {
    this.props.createMessage(subjectId, content)
  }

  updateMessage(message, content) {
    this.props.editContent(message, this.props.subject.id, content)
    this.setState({showMessageForm: null})
  }


  deleteSubject(subjectId) {
    this.props.deleteSubject([subjectId], this.props.history.push, this.props.path)
  }

  deleteMessage(messageId) {
    this.props.deleteMessage(messageId)
  }

  render() {
    if (isEmpty(this.props.subject) && !this.props.showSubjectForm) {
      return(
        <ResourcePage>
          <span>Loading</span>
        </ResourcePage>
      )
    }
    return (
      <ResourcePage poster={get(this.props.subject, 'poster')}>
        <PageHeading
          size="md"
          title={get(this.props.subject, 'title', trans('loading'))}
          actions={[
            {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit', {}, 'actions'),
              displayed: this.props.currentUser && get(this.props.subject, 'meta.creator.id', false) === this.props.currentUser.id,
              callback: () => this.editSubject(this.props.subject.id)
            }, {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-thumb-tack',
              label: trans('stick', {}, 'forum'),
              displayed: !(get(this.props.subject, 'meta.sticky', true)) && this.props.moderator,
              callback: () => this.props.stickSubject(this.props.subject)
            }, {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-thumb-tack',
              label: trans('unstick', {}, 'forum'),
              displayed: get(this.props.subject, 'meta.sticky', false) && this.props.moderator,
              callback: () => this.props.unStickSubject(this.props.subject)
            }, {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-circle-xmark',
              label: trans('close_subject', {}, 'forum'),
              displayed: !(get(this.props.subject, 'meta.closed', true)) && this.props.currentUser && (get(this.props.subject, 'meta.creator.id', false) === this.props.currentUser.id || this.props.moderator),
              callback: () => this.props.closeSubject(this.props.subject)
            }, {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-circle-check',
              label: trans('open_subject', {}, 'forum'),
              displayed: (get(this.props.subject, 'meta.closed', false)) && this.props.currentUser && (get(this.props.subject, 'meta.creator.id', false) === this.props.currentUser.id || this.props.moderator),
              callback: () => this.props.unCloseSubject(this.props.subject)
            }, {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-flag',
              label: trans('flag', {}, 'forum'),
              displayed: this.props.currentUser && (get(this.props.subject, 'meta.creator.id') !== this.props.currentUser.id) && !(get(this.props.subject, 'meta.flagged', true)),
              callback: () => this.props.flagSubject(this.props.subject)
            }, {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-flag',
              label: trans('unflag', {}, 'forum'),
              displayed: this.props.currentUser && (get(this.props.subject, 'meta.creator.id') !== this.props.currentUser.id) && (get(this.props.subject, 'meta.flagged', false)),
              callback: () => this.props.unFlagSubject(this.props.subject)
            }, {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-trash',
              label: trans('delete', {}, 'actions'),
              displayed: this.props.currentUser && get(this.props.subject, 'meta.creator.id') === this.props.currentUser.id || this.props.moderator,
              callback: () => this.deleteSubject(this.props.subject.id),
              confirm: trans('remove_subject_confirm_message', {}, 'forum'),
              dangerous: true
            }
          ]}
        />

        <PageSection size="md" className="mb-5">
          <Content
            placeholder={trans('no_content')}
            meta={
              <>
                <UserMicro
                  {...get(this.props.subject, 'meta.creator', {})}
                  // noStatus={true}
                  link={true}
                />

                <span>-</span>

                <Datetime value={get(this.props.subject, 'meta.created')} long={true} time={true} />

                {get(this.props.subject, 'meta.closed') &&
                  <Badge variant="danger" subtle={true} className="ms-auto">
                    {trans('closed_subject', {}, 'forum')}
                  </Badge>
                }
              </>
            }
            tags={get(this.props.subject, 'tags')}
          >
            {get(this.props.subject, 'content')}
          </Content>

          <div className="d-flex mt-4 gap-3" role="presentation">
            <div className="text-body-secondary fw-bolder" role="presentation">
              <span className="fa fa-fw fa-eye me-2" aria-hidden={true} />
              {transChoice('display_views', get(this.props.subject, 'meta.views', 0), {count: get(this.props.subject, 'meta.views', 0)})}
            </div>

            <div className="text-body-secondary fw-bolder" role="presentation">
              <span className="fa fa-fw fa-comment me-2" aria-hidden={true} />
              {transChoice('replies', get(this.props.subject, 'meta.messages', 0), {count: get(this.props.subject, 'meta.messages', 0)}, 'forum')}
            </div>
          </div>
        </PageSection>

        {(!this.props.showSubjectForm && !isEmpty(this.props.messages)) &&
          <PageSection size="md" className="mb-5">
            <hr className="mb-4 mt-0" />

            <ul className="posts list-unstyled">
              {this.props.messages.map(message =>
                <li key={message.id} className="post mt-4">
                  {this.state.showMessageForm === message.id ?
                    <UserMessageForm
                      user={this.props.currentUser}
                      allowHtml={true}
                      submitLabel={trans('edit', {}, 'actions')}
                      date={message.meta.created}
                      content={message.content}
                      submit={(content) => this.updateMessage(message, content)}
                      cancel={() => this.setState({showMessageForm: null})}
                    /> :
                    <UserMessage
                      user={get(message, 'meta.creator')}
                      date={message.meta.created}
                      content={message.content}
                      allowHtml={true}
                      actions={[
                        {
                          type: CALLBACK_BUTTON,
                          icon: 'fa fa-fw fa-pencil',
                          label: trans('edit', {}, 'actions'),
                          displayed: this.props.currentUser && (message.meta.creator.id === this.props.currentUser.id)  && !(get(this.props.subject, 'meta.closed', true)),
                          callback: () => this.setState({showMessageForm: message.id})
                        }, {
                          type: CALLBACK_BUTTON,
                          icon: 'fa fa-fw fa-flag',
                          label: trans('flag', {}, 'forum'),
                          displayed: this.props.currentUser && (message.meta.creator.id !== this.props.currentUser.id) && !message.meta.flagged,
                          callback: () => this.props.flag(message, this.props.subject.id)
                        }, {
                          type: CALLBACK_BUTTON,
                          icon: 'fa fa-fw fa-flag',
                          label: trans('unflag', {}, 'forum'),
                          displayed: this.props.currentUser && (message.meta.creator.id !== this.props.currentUser.id) && message.meta.flagged,
                          callback: () => this.props.unFlag(message, this.props.subject.id)
                        }, {
                          type: CALLBACK_BUTTON,
                          icon: 'fa fa-fw fa-trash',
                          label: trans('delete', {}, 'actions'),
                          displayed:  this.props.currentUser && (message.meta.creator.id === this.props.currentUser.id || this.props.moderator),
                          callback: () => this.deleteMessage(message.id),
                          confirm: trans('remove_post_confirm_message', {}, 'forum'),
                          dangerous: true
                        }
                      ]}
                    />
                  }
                  <MessageComments
                    subject={this.props.subject}
                    message={message}
                  />
                </li>
              )}
            </ul>

            {!get(this.props.subject, 'meta.closed') &&
              <UserMessageForm
                className="mt-4"
                user={this.props.currentUser}
                allowHtml={true}
                submitLabel={trans('reply', {}, 'actions')}
                submit={(message) => this.createMessage(this.props.subject.id, message)}
              />
            }
          </PageSection>
        }

        {this.props.showSubjectForm &&
          <SubjectForm />
        }
      </ResourcePage>
    )
  }
}

SubjectComponent.propTypes = {
  path: T.string.isRequired,
  currentUser: T.object,
  subject: T.shape(SubjectType.propTypes).isRequired,
  subjectForm: T.shape({
    title: T.string
  }),
  forum: T.shape({
    moderation: T.string.isRequired,
    id: T.string.isRequired
  }).isRequired,
  createMessage: T.func.isRequired,
  editContent: T.func.isRequired,
  flag: T.func.isRequired,
  stickSubject: T.func.isRequired,
  unStickSubject: T.func.isRequired,
  closeSubject: T.func.isRequired,
  unCloseSubject: T.func.isRequired,
  unFlag: T.func.isRequired,
  flagSubject: T.func.isRequired,
  unFlagSubject: T.func.isRequired,
  deleteMessage: T.func.isRequired,
  deleteSubject: T.func.isRequired,
  subjectEdition: T.func.isRequired,
  invalidated: T.bool.isRequired,
  loaded: T.bool.isRequired,
  reload: T.func.isRequired,
  showModal: T.func,
  showSubjectForm: T.bool.isRequired,
  editingSubject: T.bool.isRequired,
  messages: T.arrayOf(T.shape({})).isRequired,

  totalResults: T.number.isRequired,
  sortOrder: T.number.isRequired,
  pages: T.number,
  currentPage: T.number,
  changePage: T.func,
  changePagePrev: T.func,
  toggleSort: T.func.isRequired,
  history: T.object.isRequired,
  moderator: T.bool.isRequired
}


const Subject =  withRouter(withModal(connect(
  state => ({
    path: resourceSelectors.path(state),
    currentUser: securitySelectors.currentUser(state),
    forum: selectors.forum(state),
    subject: selectors.subject(state),
    subjectForm: formSelect.data(formSelect.form(state, `${selectors.STORE_NAME}.subjects.form`)),
    editingSubject: selectors.editingSubject(state),
    sortOrder: listSelect.sortBy(listSelect.list(state, `${selectors.STORE_NAME}.subjects.messages`)).direction,
    showSubjectForm: selectors.showSubjectForm(state),
    messages: selectors.visibleMessages(state),
    totalResults: listSelect.totalResults(listSelect.list(state, `${selectors.STORE_NAME}.subjects.messages`)),
    invalidated: listSelect.invalidated(listSelect.list(state, `${selectors.STORE_NAME}.subjects.messages`)),
    loaded: listSelect.loaded(listSelect.list(state, `${selectors.STORE_NAME}.subjects.messages`)),
    pages: listSelect.pages(listSelect.list(state, `${selectors.STORE_NAME}.subjects.messages`)),
    currentPage: listSelect.currentPage(listSelect.list(state, `${selectors.STORE_NAME}.subjects.messages`)),
    moderator: selectors.moderator(state)
  }),
  dispatch => ({
    createMessage(subjectId, content, moderation) {
      dispatch(actions.createMessage(subjectId, content, moderation))
    },
    deleteSubject(id, push, path) {
      dispatch(actions.deleteSubject(id, push, path))
    },
    deleteMessage(id) {
      dispatch(listActions.deleteData(`${selectors.STORE_NAME}.subjects.messages`, ['apiv2_forum_message_delete'], [{id: id}]))
    },
    reload(id) {
      dispatch(listActions.fetchData(`${selectors.STORE_NAME}.subjects.messages`, ['apiv2_forum_subject_get_messages', {id}]))
    },
    changePage(page) {
      dispatch(listActions.changePage(`${selectors.STORE_NAME}.subjects.messages`, page))
      dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.subjects.messages`))
    },
    subjectEdition() {
      dispatch(actions.subjectEdition())
    },
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
    },
    editContent(message, subjectId, content) {
      dispatch(actions.editContent(message, subjectId, content))
    },
    flag(message, subjectId) {
      dispatch(actions.flag(message, subjectId))
    },
    unFlag(message, subjectId) {
      dispatch(actions.unFlag(message, subjectId))
    }
  })
)(SubjectComponent)))

export {
  Subject
}
