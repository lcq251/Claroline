import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'

import {constants as listConst} from '#/main/app/content/list/constants'
import {constants} from '#/main/theme/constants'

const AppearanceMain = (props) =>
  <EditorPage
    title={trans('appearance', {}, 'tools')}
    help={trans('Personnalisez l\'affichage de l\'interface utilisateur.')}
    dataPart="appearance"
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'theme',
            type: 'choice',
            label: trans('theme', {}, 'appearance'),
            required: true,
            displayed: false,
            options: {
              condensed: true,
              noEmpty: true,
              choices: constants.MODES
            }
          }, {
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
            onChange: (value) => props.updateConfig('themeMode', value)
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
            onChange: (value) => props.updateConfig('fontSize', value)
          }, {
            name: 'fontWeight',
            type: 'choice',
            label: trans('font_weight', {}, 'appearance'),
            required: true,
            options: {
              condensed: false,
              //noEmpty: true,
              choices: constants.FONT_WEIGHTS
            },
            calculated: (data) => parseInt(data.fontWeight),
            onChange: (value) => props.updateConfig('fontWeight', value)
          }, {
            name: 'listMode',
            type: 'choice',
            label: trans('Mode d\'affichage préféré des listes', {}, 'appearance'),
            required: true,
            displayed: false,
            options: {
              condensed: false,
              noEmpty: false,
              choices: listConst.DISPLAY_MODES
            }
          }
        ]
      }
    ]}
  />

AppearanceMain.propTypes = {
  updateConfig: T.func.isRequired
}

export {
  AppearanceMain
}
