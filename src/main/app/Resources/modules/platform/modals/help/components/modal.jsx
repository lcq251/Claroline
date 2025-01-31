import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {Modal} from '#/main/app/overlays'

import {selectors} from '#/main/app/platform/store'
import {Html} from '#/main/app/components/html'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {Contact} from '#/main/app/components/contact'

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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec finibus erat a aliquet egestas. Sed sed auctor mi. Nunc bibendum nunc lacus, quis mattis velit euismod ut. Maecenas mattis, justo sed imperdiet pharetra, nibh augue eleifend nisi.
        </Html>

        <Contact
          className="mb-4"
          email="support@claroline.com"
          phone="04.50.36.83.97"
          address={{
            street1: '2 rue Marcel Porte',
            postalCode: '38100',
            city: 'Grenoble',
            country: 'fr'
          }}
        />

        <nav>
          <ul className="list-group mb-4">
            <li className="list-group-item">
              Aide
            </li>
            <li className="list-group-item">
              Plan du site
            </li>
            <li className="list-group-item">
              Conditions d'utilisation
            </li>
            <li className="list-group-item">
              Politique de confidentialité
            </li>
            <li className="list-group-item">
              Accessibilité du site
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
