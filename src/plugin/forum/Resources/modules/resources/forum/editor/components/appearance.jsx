import React from 'react'

import {trans} from '#/main/app/intl'
import {ResourceEditorAppearance} from '#/main/core/resource/editor/components/appearance'

import DISPLAY_MODES from '#/main/app/content/list/modes'

const ForumEditorAppearance = () =>
  <ResourceEditorAppearance
    definition={[
      {
        //icon: 'fa fa-fw fa-desktop',
        title: trans('subjects', {}, 'forum'),
        subtitle: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum porta dolor orci, ac venenatis sem fermentum nec.', {}, 'forum'),
        primary: true,
        fields: [
          {
            name: 'resource.display.subjectDataList',
            type: 'choice',
            label: trans('subjects_list_display', {}, 'forum'),
            options: {
              noEmpty: true,
              inline: false,
              choices: Object.keys(DISPLAY_MODES).reduce((acc, displayMode) => Object.assign(acc, {
                [displayMode]: DISPLAY_MODES[displayMode].label
              }), {})
            }
          }
        ]
      }
    ]}
  />

export {
  ForumEditorAppearance
}
