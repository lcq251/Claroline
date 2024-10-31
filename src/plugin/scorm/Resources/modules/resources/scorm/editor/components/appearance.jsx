import React from 'react'
import {useDispatch} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ResourceEditorAppearance, actions as editorActions} from '#/main/core/resource/editor'

import {constants} from '#/plugin/scorm/resources/scorm/constants'

const ScormEditorAppearance = () => {
  const dispatch = useDispatch()
  const updateProp = (prop, value) => dispatch(editorActions.updateResource(value, prop))

  return (
    <ResourceEditorAppearance
      definition={[
        {
          id: 'display',
          icon: 'fa fa-fw fa-desktop',
          title: trans('display_parameters'),
          fields: [
            {
              name: 'resource.ratioList',
              type: 'choice',
              label: trans('display_ratio_list'),
              options: {
                multiple: false,
                condensed: false,
                choices: constants.DISPLAY_RATIO_LIST
              },
              onChange: (ratio) => updateProp('ratio', parseFloat(ratio))
            }, {
              name: 'resource.ratio',
              type: 'number',
              label: trans('display_ratio'),
              options: {
                min: 0,
                unit: '%'
              },
              onChange: () => updateProp('ratioList', null)
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
