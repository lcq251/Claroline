import {connect} from 'react-redux'

import {actions as formActions} from '#/main/app/content/form/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {selectors as baseSelectors} from '#/main/community/tools/community/store'
import {EditorProfile as EditorProfileComponent} from '#/main/community/tools/community/editor/components/profile'

import {selectors} from '#/main/community/tools/community/editor/store'

const EditorProfile = connect(
  (state) => ({
    path: toolSelectors.path(state),
    loaded: toolSelectors.loaded(state),
    contextType: toolSelectors.contextType(state),
    contextId: toolSelectors.contextId(state),
    formProfile: selectors.formProfile(state),
    profile: baseSelectors.profile(state)
  }),
  (dispatch) => ({
    load(profile) {
      dispatch(formActions.load(selectors.FORM_NAME, {profile: profile}))
    }
  })
)(EditorProfileComponent)

export {
  EditorProfile
}
