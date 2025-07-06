import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {withRouter} from '#/main/app/router'
import {trans, transChoice} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {actions as listActions, selectors as listSelectors} from '#/main/app/content/list/store'
import {selectors as resourceSelectors} from '#/main/core/resource/store'
import {ResourcePage} from '#/main/core/resource'

import {Subject as SubjectType} from '#/plugin/forum/resources/forum/prop-types'
import {selectors} from '#/plugin/forum/resources/forum/store'
import {actions} from '#/plugin/forum/resources/forum/store'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {Content, ContentSkeleton} from '#/main/app/components/content'
import {PageContent, PageSection, PageToolbar, PageToolbarSkeleton} from '#/main/app/page'
import {MODAL_SUBJECT} from '#/plugin/forum/resources/forum/modals/subject'
import {ForumMessages} from '#/plugin/forum/resources/forum/components/messages'
import {ContentPublication} from '#/main/app/content/components/publication'
import {ContentMessageSkeleton} from '#/main/app/content/components/message'
import {hasPermission} from '#/main/app/security'

class SubjectComponent extends Component {
  constructor(props) {
    super(props)

    if (this.props.invalidated || !this.props.loaded) {
      this.props.reload(this.props.subject.id, this.props.forum.id)
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.invalidated !== this.props.invalidated && this.props.invalidated)
    || (prevProps.loaded !== this.props.loaded && !this.props.loaded)) {
      this.props.reload(this.props.subject.id, this.props.forum.id)
    }
  }

  deleteSubject(subjectId) {
    this.props.deleteSubject(subjectId, this.props.history.push, this.props.path)
  }

  render() {
    return (
      <ResourcePage
        title={trans('subject_name', {name: get(this.props.subject, 'title', trans('loading'))}, 'forum')}
      >
        {!this.props.loaded &&
          <PageContent className="placeholder-glow">
            <PageToolbarSkeleton toolbar="edit more" />
            <PageHeadingSkeleton backAction={trans('back_to_subjects', {}, 'forum')} />
            <PageSection className="mb-5">
              <ContentSkeleton meta={true} length={1} />

              <div className="text-body-secondary fw-bolder d-flex mt-4 gap-3" role="presentation">
                <div className="placeholder rounded-1" role="presentation">
                  <span className="fa fa-fw fa-eye me-2" aria-hidden={true} />
                  {transChoice('display_views', 0, {count: 0})}
                </div>

                <div className="placeholder rounded-1" role="presentation">
                  <span className="fa fa-fw fa-comment me-2" aria-hidden={true} />
                  {transChoice('replies', 0, {count: 0}, 'forum')}
                </div>
              </div>
            </PageSection>
            <PageSection className="mb-5">
              <hr className="mb-4 mt-0" />

              <ContentMessageSkeleton className="mt-4" />
              <ContentMessageSkeleton className="mt-4" />
              <ContentMessageSkeleton className="mt-4" />
              <ContentMessageSkeleton className="mt-4" />
            </PageSection>
          </PageContent>
        }

        {this.props.loaded &&
          <PageContent poster={get(this.props.subject, 'poster')}>
            <PageToolbar
              toolbar="edit more"
              actions={[
                {
                  name: 'edit',
                  type: MODAL_BUTTON,
                  icon: 'fa fa-fw fa-pencil',
                  label: trans('edit', {}, 'actions'),
                  displayed: hasPermission('edit', this.props.subject),
                  modal: [MODAL_SUBJECT, {
                    subject: this.props.subject,
                    forumId: this.props.forum.id
                  }]
                }, {
                  name: 'pin',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-thumb-tack',
                  label: trans('stick', {}, 'forum'),
                  displayed: !(get(this.props.subject, 'meta.sticky', true)) && hasPermission('follow', this.props.resourceNode),
                  callback: () => this.props.stickSubject(this.props.subject)
                }, {
                  name: 'unpin',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-thumb-tack',
                  label: trans('unstick', {}, 'forum'),
                  displayed: get(this.props.subject, 'meta.sticky', false) && hasPermission('follow', this.props.resourceNode),
                  callback: () => this.props.unStickSubject(this.props.subject)
                }, {
                  name: 'close',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-circle-xmark',
                  label: trans('close_subject', {}, 'forum'),
                  displayed: !(get(this.props.subject, 'meta.closed', true)) && hasPermission('edit', this.props.subject),
                  callback: () => this.props.closeSubject(this.props.subject),
                  confirm: {
                    message: trans('close_subject_confirm', {}, 'forum'),
                    additional: trans('close_subject_confirm_additional', {}, 'forum')
                  }
                }, {
                  name: 'open',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-arrow-up-right-from-square',
                  label: trans('open_subject', {}, 'forum'),
                  displayed: (get(this.props.subject, 'meta.closed', false)) && hasPermission('edit', this.props.subject),
                  callback: () => this.props.unCloseSubject(this.props.subject),
                  confirm: {
                    message: trans('open_subject_confirm', {}, 'forum'),
                    additional: trans('open_subject_confirm_additional', {}, 'forum')
                  }
                }, {
                  name: 'flag',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-flag',
                  label: trans('flag', {}, 'forum'),
                  displayed: this.props.currentUser && (get(this.props.subject, 'meta.creator.id') !== this.props.currentUser.id) && !(get(this.props.subject, 'meta.flagged', true)),
                  callback: () => this.props.flagSubject(this.props.subject)
                }, {
                  name: 'unflag',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-flag',
                  label: trans('unflag', {}, 'forum'),
                  displayed: hasPermission('follow', this.props.resourceNode),
                  callback: () => this.props.unFlagSubject(this.props.subject)
                }, {
                  name: 'delete',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-trash',
                  label: trans('delete', {}, 'actions'),
                  displayed: hasPermission('delete', this.props.subject),
                  callback: () => this.deleteSubject(this.props.subject.id),
                  confirm: trans('remove_subject_confirm_message', {}, 'forum'),
                  dangerous: true
                }
              ]}
            />

            <PageHeading
              backAction={{
                type: LINK_BUTTON,
                target: this.props.path,
                label: trans('back_to_subjects', {}, 'forum'),
                exact: true
              }}
              title={get(this.props.subject, 'title', trans('loading'))}
            />

            <PageSection className="mb-5">
              <Content
                meta={
                  <ContentPublication
                    user={get(this.props.subject, 'meta.creator', {})}
                    publishedAt={get(this.props.subject, 'meta.created')}
                  />
                }
                tags={get(this.props.subject, 'tags')}
              >
                {get(this.props.subject, 'content')}
              </Content>

              <div className="text-body-secondary fw-bolder d-flex mt-4 gap-3" role="presentation">
                <div role="presentation">
                  <span className="fa fa-fw fa-eye me-2" aria-hidden={true} />
                  {transChoice('display_views', get(this.props.subject, 'meta.views', 0), {count: get(this.props.subject, 'meta.views', 0)})}
                </div>

                <div role="presentation">
                  <span className="fa fa-fw fa-comment me-2" aria-hidden={true} />
                  {transChoice('replies', this.props.totalMessages || 0, {count: this.props.totalMessages || 0}, 'forum')}
                </div>
              </div>
            </PageSection>

            <PageSection className="mb-5">
              <hr className="mb-4 mt-0" />
              <ForumMessages
                root={true}
                messages={this.props.messages}
                canReply={!get(this.props.subject, 'meta.closed')}
                addMessage={(message, parent = null) => this.props.createMessage(this.props.subject.id, message, parent ? parent.id : null)}
                updateMessage={(message, content) => this.props.editMessage(message, this.props.subject.id, content)}
                deleteMessage={(message) => this.props.deleteMessage(message.id)}
                reportMessage={(message) => this.props.flag(message, this.props.subject.id)}
                unreportMessage={(message) => this.props.unFlag(message, this.props.subject.id)}
              />
            </PageSection>
          </PageContent>
        }
      </ResourcePage>
    )
  }
}

SubjectComponent.propTypes = {
  path: T.string.isRequired,
  resourceNode: T.object,
  currentUser: T.object,
  subject: T.shape(SubjectType.propTypes).isRequired,
  forum: T.shape({
    id: T.string.isRequired
  }).isRequired,
  createMessage: T.func.isRequired,
  editMessage: T.func.isRequired,
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
  invalidated: T.bool.isRequired,
  loaded: T.bool.isRequired,
  reload: T.func.isRequired,
  messages: T.arrayOf(T.shape({})).isRequired,
  totalMessages: T.number.isRequired,
  history: T.object.isRequired
}

const ForumSubject =  withRouter(connect(
  state => ({
    path: resourceSelectors.path(state),
    resourceNode: resourceSelectors.resourceNode(state),
    currentUser: securitySelectors.currentUser(state),
    forum: selectors.forum(state),
    subject: selectors.subject(state),
    messages: selectors.visibleMessages(state),
    totalMessages: listSelectors.totalResults(listSelectors.list(state, `${selectors.STORE_NAME}.subjects.messages`)),
    invalidated: listSelectors.invalidated(listSelectors.list(state, `${selectors.STORE_NAME}.subjects.messages`)),
    loaded: listSelectors.loaded(listSelectors.list(state, `${selectors.STORE_NAME}.subjects.messages`))
  }),
  dispatch => ({
    createMessage(subjectId, content, parentId = null) {
      dispatch(actions.createMessage(subjectId, content, parentId))
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
    editMessage(message, subjectId, content) {
      dispatch(actions.editMessage(message, subjectId, content))
    },
    flag(message, subjectId) {
      dispatch(actions.flag(message, subjectId))
    },
    unFlag(message, subjectId) {
      dispatch(actions.unFlag(message, subjectId))
    }
  })
)(SubjectComponent))

export {
  ForumSubject
}
