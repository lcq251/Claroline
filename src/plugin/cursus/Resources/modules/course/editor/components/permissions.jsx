import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const CourseEditorPermissions = () =>
  <EditorPage
    title={trans('permissions')}
    help={trans('course_permissions_help', {}, 'cursus')}
    managerOnly={true}
    definition={[
      {
        name: 'public',
        title: trans('public_course', {}, 'cursus'),
        primary: true,
        fields: [
          {
            name: 'meta.public',
            type: 'boolean',
            label: trans('make_course_public', {}, 'cursus'),
            help: [
              trans('make_course_public_help', {}, 'cursus')
            ]
          }
        ]
      }, {
        name: 'organizations',
        title: trans('organizations', {}, 'community'),
        hideTitle: true,
        primary: true,
        fields: [
          {
            name: 'organizations',
            label: trans('organizations', {}, 'community'),
            icon: 'fa fa-fw fa-building',
            type: 'organization',
            help: trans('Choisissez les organisations dans lesquels la formation doit apparaître. Seuls les membres de ces organisations pourront voir et s\'inscrire à la formation.'),
            options: {multiple: true}
          }
        ]
      }
    ]}
  />

export {
  CourseEditorPermissions
}
