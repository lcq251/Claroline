import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {Modal} from '#/main/app/overlays'

import {selectors} from '#/main/app/platform/store'
import {Html} from '#/main/app/components/html'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {Contact} from '#/main/app/components/contact'
import {trans} from '#/main/app/intl'

const HelpModal = (props) => {
  const currentOrganization = useSelector(selectors.currentOrganization)

  return (
    <Modal
      {...props}
      centered={true}
    >
      <div className="modal-body" role="presentation">
        {get(currentOrganization, 'thumbnail') &&
          <Thumbnail
            className="mb-2"
            thumbnail={get(currentOrganization, 'thumbnail')}
            square={true}
            size="md"
          />
        }

        <h1 className="h4 flex-fill mb-2">
          {get(currentOrganization, 'name')}
        </h1>

        <Html className="fs-sm text-body-secondary mb-4">
          {get(currentOrganization, 'meta.description')}
        </Html>

        <Contact
          className="mb-4"
          email={get(currentOrganization, 'email')}
          phone={get(currentOrganization, 'phone')}
          address={get(currentOrganization, 'address')}
        />

        <nav>
          <ul className="list-group mb-4">
            <li className="list-group-item">
              Aide
              <span className="ms-2 fa fa-arrow-up-right-from-square fs-sm" aria-hidden={true} />
              <span className="visually-hidden" role="presentation">{trans('external_link')}</span>
            </li>
            <li className="list-group-item">
              Plan du site
            </li>
            <li className="list-group-item">
              Accessibilité : Non conforme
            </li>
            <li className="list-group-item">
              Conditions d'utilisation
            </li>
            <li className="list-group-item">
              Politique de confidentialité
            </li>
          </ul>
        </nav>
        <small className="text-body-secondary">v15.0.0</small>
      </div>
    </Modal>
  )
}

export {
  HelpModal
}
