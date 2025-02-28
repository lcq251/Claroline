import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'

const CreationStart = (props) =>
  <div className="modal-body" role="presentation">
    <ContentMenu
      className="mb-3"
      items={[
        {
          id: 'create-empty',
          icon: 'plus',
          label: trans('Créer un nouvel utilisateur'),
          description: trans('Ajoutez un utilisateur pour lui permettre de se connecter à votre plateforme.'),
          action: {
            type: CALLBACK_BUTTON,
            callback: props.startCreation
          }
        }, {
          id: 'create-from-organization',
          icon: 'building',
          label: trans('Ajouter depuis une autre organization'),
          description: trans('Sélectionnez un utilisateur existant dans une autre organization.'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => true
          }
        }
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
