import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/audio-player/resources/audio/store/selectors'
import {makeInstanceAction} from '#/main/app/store/actions'
import {RESOURCE_LOAD} from '#/main/core/resource/store'

const reducer = combineReducers({
  resource: makeReducer({}, {
    [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: (state, action) => action.resourceData.resource,
    //[makeInstanceAction(FORM_SUBMIT_SUCCESS, editorSelectors.FORM_NAME)]: (state, action) => action.updatedData
  }),
  comments: makeListReducer(selectors.STORE_NAME+'.comments')
})

export {
  reducer
}
