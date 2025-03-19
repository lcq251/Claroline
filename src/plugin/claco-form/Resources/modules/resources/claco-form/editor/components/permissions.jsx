import React from 'react'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {ResourceEditorPermissions} from '#/main/core/resource/editor'

import {selectors} from '#/plugin/claco-form/resources/claco-form/editor/store'

const ClacoFormEditorPermissions = () => {
  const categories = useSelector(selectors.categories)

  return (
    <ResourceEditorPermissions
      definition={[
        {
          title: trans('Permissions sur les fiches'),
          description: trans('Donnez des droits d\'accès et de modifications sur les fiches de la base de données. Les utilisateurs ayant la permission "Modifier" ne sont pas affectés.'),
          primary: true,
          fields: [
            {
              name: 'resource.details.edition_enabled',
              type: 'boolean',
              label: trans('allow_entry_edition', {}, 'clacoform'),
              help: trans('allow_entry_edition_help', {}, 'clacoform')
            }, {
              name: 'resource.details.search_enabled',
              type: 'boolean',
              label: trans('allow_entry_search', {}, 'clacoform'),
              help: trans('allow_entry_search_help', {}, 'clacoform')
            }, {
              name: 'resource.random.enabled',
              type: 'boolean',
              label: trans('label_random_enabled', {}, 'clacoform'),
              linked: [
                {
                  name: 'resource.random.categories',
                  type: 'choice',
                  label: trans('label_random_categories', {}, 'clacoform'),
                  displayed: (formData) => !isEmpty(categories) && get(formData, 'resource.random.enabled', false),
                  options: {
                    multiple: true,
                    condensed: false,
                    inline: false,
                    choices: categories ? categories.reduce((acc, cat) => Object.assign(acc, {
                      [cat.id]: cat.name
                    }), {}) : {}
                  }
                }, {
                  name: 'resource.random.dates',
                  type: 'date-range',
                  label: trans('label_random_dates', {}, 'clacoform'),
                  displayed: (formData) => get(formData, 'resource.random.enabled', false)
                }
              ]
            },
          ]
        }
      ]}
    />
  )
}

export {
  ClacoFormEditorPermissions
}
