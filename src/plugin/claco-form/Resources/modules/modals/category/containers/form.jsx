import {connect} from 'react-redux'

import {actions as formActions, selectors as formSelectors} from '#/main/app/content/form/store'

import {CategoryFormModal as CategoryFormModalComponent} from '#/plugin/claco-form/modals/category/components/form'

const CategoryFormModal = connect(
  (state) => ({
    formData: formSelectors.data(formSelectors.form(state, 'clacoFormCategoryForm'))
  }),
  (dispatch) => ({
    updateProp(prop, value) {
      dispatch(formActions.updateProp('clacoFormCategoryForm', prop, value))
    }
  })
)(CategoryFormModalComponent)

export {
  CategoryFormModal
}
