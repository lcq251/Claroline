import React, {useId, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {MENU_BUTTON} from '#/main/app/buttons'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {Menu} from '#/main/app/overlays/menu'
import {Html} from '#/main/app/components/html'
import {Contact} from '#/main/app/components/contact'

import {selectors} from '#/main/app/platform/store'
import {CloseButton} from 'react-bootstrap'

const HelpMenu = (props) => {
  const currentOrganization = useSelector(selectors.currentOrganization)

  return (
    <Menu id={props.id} className="app-user-menu flyout-menu p-0 position-fixed">
      <div className="flyout-menu-content d-flex flex-column flex-fill p-3" role="presentation">
        <div className="flyout-menu-close fs-sm rounded-pill bg-body position-absolute end-0 top-0" role="presentation">
          <CloseButton onClick={props.closeMenu} className="rounded-pill" />
        </div>

        <Thumbnail
          thumbnail={get(currentOrganization, 'thumbnail')}
          name={get(currentOrganization, 'name')}
          square={true}
          size="md"
        />

        <h2 className="h5 mb-1 mt-3">
          {get(currentOrganization, 'name')}
        </h2>

        <Html className="text-body-secondary mb-3">
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

        <small className="text-body-secondary mt-auto">v15.0.0</small>
      </div>
    </Menu>
  )
}

HelpMenu.propTypes = {
  id: T.string.isRequired,
  closeMenu: T.func.isRequired
}

const PlatformMenuHelp = () => {
  const menuId = useId()
  const [menuOpened, setMenuOpened] = useState(false)

  return (
    <div role="contentinfo">
      <Button
        type={MENU_BUTTON}
        icon="fa fa-question"
        label={trans('help_center')}
        tooltip="right"
        className="app-context-btn focus-ring rounded-circle"
        opened={menuOpened}
        onToggle={setMenuOpened}
        menu={{
          drop: 'end',
          render: () => (
            <HelpMenu
              id={menuId}
              closeMenu={() => setMenuOpened(false)}
            />
          )
        }}
        aria-controls={menuId}
      />
    </div>
  )
}

export {
  PlatformMenuHelp
}
