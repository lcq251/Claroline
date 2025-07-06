import cloneDeep from 'lodash/cloneDeep'

import {makeInstanceAction} from '#/main/app/store/actions'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'

import {RESOURCE_LOAD} from '#/main/core/resource/store'
import {selectors} from '#/main/core/resources/file/store/selectors'

const reducer = combineReducers({
  file: makeReducer({}, {
    [makeInstanceAction(RESOURCE_LOAD, 'file')]: (state, action) => action.resourceData.file,
    // replaces file data after success updates
    [FORM_SUBMIT_SUCCESS+'/'+selectors.STORE_NAME+'.fileForm']: (state, action) => action.updatedData
  })
})

export {
  reducer
}
