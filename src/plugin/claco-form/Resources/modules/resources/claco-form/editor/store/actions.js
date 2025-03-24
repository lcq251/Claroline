import {actions as formActions} from '#/main/app/content/form/store'
import {selectors as editorSelectors} from '#/main/core/resource/editor/store'

const actions = {}

actions.updateCategories = (categories) => formActions.updateProp(editorSelectors.STORE_NAME, 'categories', categories)

export {
  actions
}