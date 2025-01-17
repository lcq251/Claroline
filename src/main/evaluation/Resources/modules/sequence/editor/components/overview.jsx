import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const SequenceEditorOverview = () =>
  <EditorPage
    title={trans('overview')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'poster',
            label: trans('poster'),
            type: 'poster',
            hideLabel: true
          }, {
            name: 'name',
            label: trans('name'),
            type: 'string',
            required: true,
            autoFocus: true
          }, {
            name: 'code',
            label: trans('code'),
            type: 'string',
            required: true
          }, {
            name: 'meta.published',
            label: trans('publish', {}, 'actions'),
            type: 'boolean',
            help: trans('Temps que la séquence n\'est pas publiée, elle est uniquement accessible aux utilisateurs ayant la permission "Modifier".', {}, 'evaluation')
          }
        ]
      }, {
        title: trans('further_information'),
        subtitle: trans('further_information_help'),
        primary: true,
        fields: [
          {
            name: 'meta.description',
            label: trans('description_short'),
            help: trans('description_short_help', {}, 'resource'),
            type: 'string',
            recommended: true,
            options: {
              long: true,
              minRows: 2
            }
          }, {
            name: 'meta.descriptionHtml',
            label: trans('description_long'),
            type: 'html',
            help: trans('description_long_help', {}, 'resource'),
          }, {
            name: 'tags',
            label: trans('tags'),
            type: 'tag'
          }
        ]
      }
    ]}
  />

export {
  SequenceEditorOverview
}
