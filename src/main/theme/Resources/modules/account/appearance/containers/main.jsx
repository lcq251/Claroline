import {connect} from 'react-redux'
import {withReducer} from '#/main/app/store/components/withReducer'

import {actions as configActions} from '#/main/app/config/store'

import {AppearanceMain as AppearanceMainComponent} from '#/main/theme/account/appearance/components/main'
import {selectors, reducer} from '#/main/theme/account/appearance/store'

const AppearanceMain = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      updateConfig(configKey, configValue) {
        dispatch(configActions.updateConfig('theme.'+configKey, configValue))
      }
    })
  )(AppearanceMainComponent)
)

export {
  AppearanceMain
}
