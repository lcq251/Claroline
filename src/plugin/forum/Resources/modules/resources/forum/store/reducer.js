import cloneDeep from 'lodash/cloneDeep'

import {makeInstanceAction} from '#/main/app/store/actions'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'

import {RESOURCE_LOAD} from '#/main/core/resource/store'

import {FORUM_TOGGLE_NOTIFICATION} from '#/plugin/forum/resources/forum/store/actions'
import {selectors} from '#/plugin/forum/resources/forum/store/selectors'
import {makeFormReducer} from '#/main/app/content/form/store'
import {
  SUBJECT_EDIT,
  SUBJECT_FORM_CLOSE,
  SUBJECT_FORM_OPEN, SUBJECT_LOAD,
  SUBJECT_STOP_EDIT
} from '#/plugin/forum/resources/forum/store/actions'
import {makeListReducer} from '#/main/app/content/list/store'

const reducer = combineReducers({
  forum: makeReducer({}, {
    [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: (state, action) => action.resourceData.resource,
    [FORM_SUBMIT_SUCCESS+'/'+selectors.STORE_NAME+'.forumForm']: (state, action) => action.updatedData.resource
  }),
  notified: makeReducer(false, {
    [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: (state, action) => action.resourceData.notified,
    [FORUM_TOGGLE_NOTIFICATION]: (state, action) => action.notified
  }),
  subjects: combineReducers({
    form: makeFormReducer(`${selectors.STORE_NAME}.subjects.form`, {
      showSubjectForm: false,
      editingSubject: false
    }, {
      showSubjectForm: makeReducer(false, {
        [SUBJECT_FORM_OPEN]: () => true,
        [SUBJECT_FORM_CLOSE]: () => false
      }),
      editingSubject: makeReducer(false, {
        [SUBJECT_EDIT]: () => true,
        [SUBJECT_STOP_EDIT]: () => false
      })
    }),
    list: makeListReducer(`${selectors.STORE_NAME}.subjects.list`, {
      sortBy: {property: 'sticked', direction: -1}
    }, {
      invalidated: makeReducer(false, {
        [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: () => true
      })
    }),
    current: makeReducer({}, {
      [FORM_SUBMIT_SUCCESS+`/${selectors.STORE_NAME}.subjects.form`]: (state, action) => action.updatedData,
      [SUBJECT_LOAD]: (state, action) => action.subject
    }),
    messages: makeListReducer(`${selectors.STORE_NAME}.subjects.messages`, {
      pageSize: 10,
      sortBy: {property: 'creationDate', direction : 1}
    }, {
      invalidated: makeReducer(false, {
        [makeInstanceAction(RESOURCE_LOAD, selectors.STORE_NAME)]: () => true
      })
    })
  })
})

export {
  reducer
}
