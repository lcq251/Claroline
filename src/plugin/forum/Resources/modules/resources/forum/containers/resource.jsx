import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {ForumResource as ForumResourceComponent} from '#/plugin/forum/resources/forum/components/resource'
import {actions, reducer, selectors} from '#/plugin/forum/resources/forum/store'
import {actions as listActions} from '#/main/app/content/list/store'
import {selectors as resourceSelectors} from '#/main/core/resource'

const ForumResource = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      currentUser: securitySelectors.currentUser(state),
      forum: selectors.forum(state),
      moderator: selectors.moderator(state),
      notified: selectors.notified(state),
      path: resourceSelectors.path(state),
      editingSubject: selectors.editingSubject(state),
      showSubjectForm: selectors.showSubjectForm(state)
    }),
    (dispatch) => ({
      loadLastMessages(forum) {
        dispatch(actions.fetchLastMessages(forum))
      },
      notify(forum, user) {
        dispatch(actions.notify(forum, user))
      },
      stopNotify(forum, user) {
        dispatch(actions.stopNotify(forum, user))
      },
      newSubject(id) {
        dispatch(actions.newSubject(id))
      },
      openSubject(id) {
        dispatch(actions.openSubject(id))
      },
      closeSubjectForm() {
        dispatch(actions.closeSubjectForm())
      },
      stopSubjectEdition() {
        dispatch(actions.stopSubjectEdition())
      },
      loadSubjectList() {
        dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.subjects.list`))
      },
      invalidateMessagesList() {
        dispatch(listActions.invalidateData(`${selectors.STORE_NAME}.subjects.messages`))
      }
    })
  )(ForumResourceComponent)
)

export {
  ForumResource
}
