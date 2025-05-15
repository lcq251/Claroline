import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const CourseEditorAppearance = (props) =>
  <EditorPage
    title={trans('appearance')}
    help={trans('course_appearance_help', {}, 'cursus')}
    definition={[
      {
        icon: 'fa fa-fw fa-desktop',
        title: trans('display_parameters'),
        primary: true,
        fields: [
          {
            name: 'poster',
            label: trans('poster'),
            type: 'image'
          }, {
            name: 'thumbnail',
            label: trans('thumbnail'),
            recommended: true,
            type: 'image'
          }/*, {
            name: 'display.order',
            type: 'number',
            label: trans('order'),
            required: true,
            options: {
              min: 0
            }
          }*/
        ]
      }, {
        title: trans('advanced'),
        primary: true,
        hideTitle: true,
        fields: [
          {
            name: 'data.restrictions.hidden',
            type: 'boolean',
            label: trans('restrict_hidden'),
            help: trans('restrict_hidden_help')
          }, {
            name: 'display.hideSessions',
            type: 'boolean',
            label: trans('hide_sessions', {}, 'cursus')
          }
        ]
      }, {
        name: 'opening',
        title: trans('opening_parameters'),
        description: trans('Configurez la façon dont votre formation va s\'ouvrir.'),
        primary: true,
        fields: [
          {
            name: 'opening.session',
            label: trans('opening_session', {}, 'cursus'),
            type: 'choice',
            required: true,
            options: {
              noEmpty: true,
              condensed: false,
              choices: {
                none: trans('opening_session_none', {}, 'cursus'),
                first_available: trans('opening_session_first_available', {}, 'cursus'),
                default: trans('opening_session_default', {}, 'cursus')
              }
            },
            help: trans('opening_session_help', {}, 'cursus')
          }
        ]
      }
    ]}
  >
    {props.children}
  </EditorPage>

export {
  CourseEditorAppearance
}
