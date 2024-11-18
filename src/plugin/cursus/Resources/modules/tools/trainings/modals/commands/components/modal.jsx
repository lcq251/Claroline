import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'

import {ModalEmpty} from '#/main/app/overlays/modal/components/empty'
import {Button, Toolbar} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import isEmpty from 'lodash/isEmpty'

const CommandsModal = (props) => {
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isEmpty(search) && search.length >= 3) {
      // call server
    }
  }, [search])

  return (
    <ModalEmpty {...props} className="command-palette">
      <div className="command-palette-search" role="search">
        <span className="fa fa-search text-body-tertiary" aria-hidden={true} />
        <input
          type="text"
          autoFocus={true}
          placeholder={trans('search', {}, 'actions')}
          value={search}
          onChange={(e) => setSearch(e.target.value || '')}
        />

        {!isEmpty(search) &&
          <Button
            className="command-palette-clear btn btn-text-secondary"
            type={CALLBACK_BUTTON}
            icon="fa fa-times"
            label={trans('delete', {}, 'actions')}
            tooltip="bottom"
            callback={() => setSearch('')}
          />
        }
      </div>

      <Toolbar
        className="command-palette-actions p-2 d-grid border-top"
        buttonName="btn text-reset rounded-2 w-100 text-start fw-normal"
        actions={[
          {
            name: 'add-course',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-graduation-cap text-body-tertiary me-3',
            label: trans('Ajouter une formation'),
            callback: () => true
          }, {
            name: 'plan-session',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-calendar-week text-body-tertiary me-3',
            label: trans('Planifier une session'),
            callback: () => true
          }, {
            name: 'plan-event',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-calendar-day text-body-tertiary me-3',
            label: trans('Planifier une séance'),
            callback: () => true
          }, {
            name: 'register',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-user-plus text-body-tertiary me-3',
            label: trans('Inscrire des utilisateurs'),
            callback: () => true
          },
        ]}
      />
    </ModalEmpty>
  )
}

CommandsModal.propTypes = {
  searchUrl: T.oneOfType([T.string, T.array])
}

export {
  CommandsModal
}
