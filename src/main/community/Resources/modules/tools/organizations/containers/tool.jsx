import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/reducer'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {OrganizationsTool as OrganizationsToolComponent} from '#/main/community/tools/organizations/components/tool'
import {actions, reducer, selectors} from '#/main/community/tools/organizations/store'

const OrganizationsTool = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    state => ({
      path: toolSelectors.path(state)
    }),
    dispatch => ({
      open(id) {
        dispatch(actions.open(id))
      },
      new() {
        dispatch(actions.new())
      }
    })
  )(OrganizationsToolComponent)
)

export {
  OrganizationsTool
}
