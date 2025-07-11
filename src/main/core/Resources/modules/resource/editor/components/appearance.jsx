import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {DataFormSection as DataFormSectionTypes} from '#/main/app/content/form/prop-types'
import {EditorPage} from '#/main/app/editor'

const ResourceEditorAppearance = (props) =>
  <EditorPage
    title={trans('appearance')}
    help={trans('Personnalisez les paramètres d\'affichage avancés de votre ressource et de son contenu.')}
    definition={[
      {
        title: trans('display_parameters'),
        primary: true,
        fields: [
          {
            name: 'resourceNode.restrictions.hidden',
            type: 'boolean',
            label: trans('restrict_hidden'),
            help: trans('restrict_hidden_help')
          }
        ]
      }
    ].concat(props.definition || [])}
    locked={props.locked}
  >
    {props.children}
  </EditorPage>

ResourceEditorAppearance.propTypes = {
  definition: T.arrayOf(T.shape(
    DataFormSectionTypes.propTypes
  )),
  locked: T.arrayOf(T.string),
  children: T.any
}

export {
  ResourceEditorAppearance
}
