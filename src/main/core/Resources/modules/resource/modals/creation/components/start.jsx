import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'

import {MODAL_RESOURCES} from '#/main/core/modals/resources'

const CreationStart = props =>
  <div className="modal-body" role="presentation">
    <ContentMenu
      className="mb-3"
      items={[
        {
          id: 'create-empty',
          icon: 'plus',
          label: trans('Créer une ressource'),
          description: trans('Créez une ressource vide pour pouvoir choisir son type et la configurer comme vous le souhaitez.'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => props.changeStep('type')
          }
        }, {
          id: 'create-directory',
          icon: 'folder',
          label: trans('Créer un dossier'),
          description: trans('Créez un dossier pour organiser vos différentes ressources.'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => {
              props.startCreation('directory', {meta: {published: true}})
              props.changeStep('info')
            }
          }
        }, {
          id: 'create-from-file',
          icon: 'file',
          label: trans('Importer un fichier'),
          description: trans('Déposez un fichier pour l\'ajouter à  votre espace. Le type de ressource créé dépend du fichier déposé.'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => props.changeStep('upload')
          },
          group: 'A partir d\'un contenu existant'
        }, {
          id: 'create-from-url',
          icon: 'link',
          label: trans('Créer à partir d\'une URL'),
          description: trans('Saisissez une URL pour pouvoir l\'utiliser dans votre espace. Le type de ressource créé dépend de l\'URL saisie.'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => props.changeStep('url')
          },
          group: 'A partir d\'un contenu existant'
        }, {
          id: 'create-shortcut',
          icon: 'arrow-up-right-from-square',
          label: trans('Créer un raccourci'),
          description: trans('Créez un raccourci vers une autre ressource de la plateforme.'),
          action: {
            type: MODAL_BUTTON,
            modal: [MODAL_RESOURCES, {
              contextId: props.contextId,
              multiple: false,
              selectAction: (selected) => ({
                type: CALLBACK_BUTTON,
                callback: () => {
                  props.startCreation('shortcut', {
                    name: selected[0].name,
                    code: selected[0].code,
                    thumbnail: selected[0].thumbnail,
                    poster: selected[0].poster,
                    meta: {
                      published: true,
                      description: get(selected[0], 'meta.description')
                    }
                  }, {
                    target: merge({}, selected[0])
                  })

                  props.changeStep('info')
                }
              })
            }]
          }
        }, {
          id: 'create-from-copy',
          icon: 'clone',
          label: trans('Copier une ressource existante'),
          description: trans('Dupliquez une ressource de la plateforme ainsi que tous ses contenus.'),
          action: {
            type: MODAL_BUTTON,
            modal: [MODAL_RESOURCES, {
              contextId: props.contextId,
              multiple: false,
              selectAction: (selected) => ({
                type: CALLBACK_BUTTON,
                callback: () => {
                  props.startCreation(get(selected[0], 'meta.type'), merge({}, selected[0]))
                  props.changeStep('info')
                }
              })
            }]
          },
          group: 'A partir d\'un contenu existant'
        },
      ]}
    />
  </div>

CreationStart.propTypes = {
  contextId: T.string,
  changeStep: T.func.isRequired,
  startCreation: T.func.isRequired
}

export {
  CreationStart
}
