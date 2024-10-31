import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const UserEditorIntl = () =>
  <EditorPage
    title={trans('Langue')}
    help={trans('Choisissez la langue et le format de date à utiliser dans votre compte.')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'meta.locale',
            type: 'locale',
            label: trans('language'),
            required: true
          }
        ]
      }, {
        name: 'date',
        title: trans('Date & Heure'),
        description: trans('Lorem ipsum dolor sit amet'),
        primary: true,
        fields: [
          {
            name: 'meta.dateFormat',
            type: 'string',
            label: trans('Format des dates')
          }, {
            name: 'meta.timeFormat',
            type: 'string',
            label: trans('Format des heures')
          }, {
            name: 'meta.timezone',
            type: 'timezone',
            label: trans('timezone')
          }
        ]
      }
    ]}
  />

export {
  UserEditorIntl
}
