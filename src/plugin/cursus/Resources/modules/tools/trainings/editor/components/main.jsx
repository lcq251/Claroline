import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {ToolEditor} from '#/main/core/tool/editor/containers/main'

import {TrainingsEditorArchives} from '#/plugin/cursus/tools/trainings/editor/components/archives'

const TrainingsEditor = (props) =>
  <ToolEditor
    pages={[
      {
        name: 'archive',
        title: trans('archives'),
        help: trans('archived_trainings_help', {}, 'cursus'),
        render: () => (
          <TrainingsEditorArchives
            path={props.path}
          />
        )
      }
    ]}
  />

TrainingsEditor.propTypes = {
  path: T.string.isRequired
}

export {
  TrainingsEditor
}
