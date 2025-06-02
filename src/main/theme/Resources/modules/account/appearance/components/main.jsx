import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {actions as configActions} from '#/main/app/config/store'

import {selectors} from '#/main/community/user/editor'
import {constants} from '#/main/theme/constants'

const AppearanceMain = () => {
  const dispatch = useDispatch()
  const currentUserId = useSelector(securitySelectors.currentUserId)
  const formUserId = useSelector(selectors.userId)

  const updateConfig = useCallback((configKey, configValue) => {
    if (currentUserId === formUserId) {
      // dynamically update ui parameters based on the current config
      dispatch(configActions.updateConfig('theme.'+configKey, configValue))
    }
  }, [currentUserId, formUserId])

  return (
    <EditorPage
      title={trans('appearance', {}, 'tools')}
      help={trans('Personnalisez l\'affichage de l\'interface utilisateur.')}
      dataPart="preferences.theme"
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'themeMode',
              type: 'choice',
              label: trans('theme_mode', {}, 'appearance'),
              required: true,
              options: {
                condensed: false,
                noEmpty: true,
                choices: constants.MODES
              },
              calculated: (data) => !data.themeMode ? constants.MODE_AUTO : data.themeMode,
              onChange: (value) => updateConfig('themeMode', value)
            }, {
              name: 'fontSize',
              type: 'choice',
              label: trans('font_size', {}, 'appearance'),
              required: true,
              options: {
                condensed: false,
                noEmpty: true,
                choices: constants.FONT_SIZES
              },
              onChange: (value) => updateConfig('fontSize', value)
            }, {
              name: 'fontWeight',
              type: 'choice',
              label: trans('font_weight', {}, 'appearance'),
              required: true,
              options: {
                condensed: false,
                choices: constants.FONT_WEIGHTS
              },
              calculated: (data) => parseInt(data.fontWeight),
              onChange: (value) => updateConfig('fontWeight', value)
            }, {
              name: 'striped',
              type: 'boolean',
              label: trans('striped', {}, 'appearance'),
              help: trans('striped_help', {}, 'appearance')
            }
          ]
        }
      ]}
    />
  )
}

export {
  AppearanceMain
}
