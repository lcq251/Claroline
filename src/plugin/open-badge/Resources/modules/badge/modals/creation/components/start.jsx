import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'

import {Modal} from '#/main/app/overlays'

const BadgeCreationStart = props => {
  return (
    <Modal
      {...omit(props, 'changeStep')}
    >
      <div className="modal-body" role="presentation">
        <ContentMenu
          className="mb-3"
          items={[
            {
              id: 'create-empty',
              icon: 'plus',
              label: trans('Créer un badge'),
              description: trans('Créez un nouveau badge pour pouvoir choisir son type et le configurer comme vous le souhaitez.'),
              action: {
                type: CALLBACK_BUTTON,
                callback: () => props.changeStep('type')
              }
            }, {
              id: 'create-from-organization',
              icon: 'building',
              label: trans('Ajouter depuis une autre organization'),
              description: trans('Sélectionnez un badge existant dans une autre organization pour le rendre accessible aux membres de l\'organization <b>Organization name</b>.'),
              action: {
                type: CALLBACK_BUTTON,
                callback: () => props.changeStep('organization')
              },
              group: 'A partir d\'un contenu existant'
            },
          ]}
        />
      </div>
    </Modal>
  )
}

BadgeCreationStart.propTypes = {
  changeStep: T.func.isRequired
}

export {
  BadgeCreationStart
}
