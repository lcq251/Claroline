import React from 'react'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {ResourceEditorAppearance, actions as editorActions} from '#/main/core/resource/editor'

import {constants} from '#/plugin/scorm/resources/scorm/constants'

const ScormEditorAppearance = () => {
  const dispatch = useDispatch()
  const updateProp = (prop, value) => dispatch(editorActions.updateResource(value, prop))

  return (
    <ResourceEditorAppearance
      locked={[
        'resourceNode.poster'
      ]}
      definition={[
        {
          id: 'ratio',
          title: trans('display_ratio'),
          description: (trans('display_ratio_help')),
          primary: true,
          fields: [
            {
              name: 'resource._ratioList',
              type: 'choice',
              required: true,
              label: trans('display_ratio'),
              hideLabel: true,
              options: {
                multiple: false,
                condensed: false,
                choices: constants.DISPLAY_RATIO_LIST
              },
              calculated: (data) => get(data, 'resource.ratio') && constants.DISPLAY_RATIO_LIST[get(data, 'resource.ratio')] ? get(data, 'resource.ratio') : 'other',
              onChange: (ratio) => updateProp('ratio', 'other' !== ratio ? parseFloat(ratio) : null),
              linked: [{
                name: 'resource.ratio',
                type: 'number',
                label: trans('display_ratio_percentage'),
                options: {
                  min: 0,
                  unit: '%'
                },
                hideLabel: true,
                required: true,
                displayed: (data) => 'other' === get(data, 'resource.ratio', 'other') || !constants.DISPLAY_RATIO_LIST[get(data, 'resource.ratio', 'other')]
              }]
            }
          ]
        }
      ]}
    />
  )
}

export {
  ScormEditorAppearance
}
