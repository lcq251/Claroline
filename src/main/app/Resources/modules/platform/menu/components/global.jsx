import React, {useId} from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Thumbnail} from '#/main/app/components/thumbnail'

import {MODAL_SEARCH} from '#/main/app/platform/modals/search'
import {selectors} from '#/main/app/platform/store'

const PlatformMenuGlobal = (props) => {
  const currentOrganization = useSelector(selectors.currentOrganization)

  const globalTitleId = useId()
  const globalDescId = useId()

  return (
    <>
      <h2 id={globalTitleId} className="visually-hidden">{trans('global_links')}</h2>
      <p id={globalDescId} className="visually-hidden">{trans('global_links_help')}</p>
      <ul
        className="app-main-menu-group list-unstyled d-flex gap-2 mb-0"
        aria-labelledby={globalTitleId}
        aria-describedby={globalDescId}
      >
        <li>
          <Button
            type={LINK_BUTTON}
            className="app-context-btn position-relative focus-ring"
            label={trans('desktop', {}, 'context')}
            tooltip={props.vertical ? 'right' : 'top'}
            target="/desktop"
          >
            <Thumbnail
              size="sm"
              thumbnail={currentOrganization.thumbnail}
              name={currentOrganization.name}
              square={true}
            />
          </Button>
        </li>
        <li>
          <div role="search">
            <Button
              type={MODAL_BUTTON}
              className="app-context-btn focus-ring"
              icon="fa fa-fw fa-search"
              label={trans('search')}
              tooltip={props.vertical ? 'right' : 'top'}
              modal={[MODAL_SEARCH]}
            />
          </div>
        </li>
      </ul>
      <hr
        className="app-main-menu-separator m-0"
        aria-hidden={true}
      />
    </>
  )
}

export {
  PlatformMenuGlobal
}
