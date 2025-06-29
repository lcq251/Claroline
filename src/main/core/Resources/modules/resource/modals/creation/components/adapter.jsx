import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'
import {Button} from '#/main/app/action'

const CreationAdapter = props =>
  <>
    <div className="modal-body" role="presentation">
      <ContentMenu
        className="mb-3"
        items={[
          {
            id: 'create-from-file',
            icon: 'file',
            label: trans('Importer un fichier'),
            description: trans('Déposez un fichier pour l\'ajouter à  votre espace. Le type de ressource créé dépend du fichier déposé.'),
            action: {
              type: CALLBACK_BUTTON,
              callback: () => props.changeStep('file')
            }
          }, {
            id: 'create-from-url',
            icon: 'link',
            label: trans('Créer à partir d\'une URL'),
            description: trans('Saisissez une URL pour pouvoir l\'utiliser dans votre espace. Le type de ressource créé dépend de l\'URL saisie.'),
            action: {
              type: CALLBACK_BUTTON,
              callback: () => props.changeStep('url')
            }
          }
        ]}
      />
    </div>

    <div className="modal-footer">
      <Button
        type={CALLBACK_BUTTON}
        label={trans('back')}
        className="btn btn-text-body me-auto"
        callback={() => props.changeStep('type')}
      />
    </div>
  </>

CreationAdapter.propTypes = {
  changeStep: T.func.isRequired
}

export {
  CreationAdapter
}
