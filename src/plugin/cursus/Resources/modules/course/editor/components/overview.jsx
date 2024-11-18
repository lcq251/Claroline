import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const CourseEditorOverview = () =>
  <EditorPage
    title={trans('overview')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'poster',
            type: 'poster',
            label: trans('poster'),
            hideLabel: true
          }, {
            name: 'name',
            type: 'string',
            label: trans('name'),
            required: true
          }, {
            name: 'code',
            type: 'string',
            label: trans('code'),
            required: true
          }
        ]
      }, {
        title: trans('further_information'),
        subtitle: trans('further_information_help'),
        primary: true,
        fields: [
          {
            name: 'plainDescription',
            type: 'string',
            label: trans('description_short'),
            help: trans('course_short_desc_help', {}, 'cursus'),
            recommended: true,
            options: {
              long: true,
              minRows: 2
            }
          }, {
            name: 'description',
            label: trans('description_long'),
            type: 'html',
            recommended: true,
            help: trans('course_long_desc_help', {}, 'cursus'),

          }, {
            name: 'meta.duration',
            type: 'number',
            label: trans('duration'),
            required: true,
            options: {
              min: 0,
              unit: trans('hours')
            }
          }, {
            name: 'pricing.price',
            label: trans('price'),
            type: 'currency',
            linked: [
              {
                name: 'pricing.description',
                label: trans('comment'),
                type: 'string',
                options: {
                  long: true
                }
              }
            ]
          }, {
            name: 'certification',
            type: 'string',
            label: trans('Certification', {}, 'cursus'),
            options: {long: true, minRows: 2},
            help: trans('Définissez les titres et dipômes obtenus par les utilisateurs suivant cette formation.', {}, 'cursus')
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
  CourseEditorOverview
}
