import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {Modal} from '#/main/app/overlays'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_USERS} from '#/main/community/modals/users'
import {UserCard} from '#/main/community/user/components/card'
import {ListData} from '#/main/app/content/list'

import {selectors} from '#/plugin/claco-form/resources/claco-form/player/modals/shared/store/selectors'

const SharedModal = (props) =>
  <Modal
    {...omit(props, 'entryId', 'shareEntry')}
    icon="fa fa-fw fa-share-alt"
    title={trans('shared_with', {}, 'clacoform')}
  >
    <div className="modal-body" role="presentation">
      <Button
        className="btn btn-primary"
        {...{
          name: 'share',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-share-alt',
          label: trans('share', {}, 'actions'),
          modal: [MODAL_USERS, {
            selectAction: (users) => ({
              type: CALLBACK_BUTTON,
              label: trans('share', {}, 'actions'),
              callback: () => props.shareEntry(props.entryId, users)
            })
          }]
        }}
      />
    </div>

    <ListData
      flush={true}
      name={selectors.STORE_NAME}
      fetch={{
        url: ['claro_claco_form_entry_shared_users_list', {entry: props.entryId}],
        autoload: true
      }}
      delete={{
        url: ['claro_claco_form_entry_user_unshare', {entry: props.entryId}]
      }}
      definition={[
        {
          name: 'username',
          type: 'string',
          label: trans('username'),
          displayed: true,
          primary: true
        }, {
          name: 'lastName',
          type: 'string',
          label: trans('last_name'),
          displayed: true
        }, {
          name: 'firstName',
          type: 'string',
          label: trans('first_name'),
          displayed: true
        }
      ]}
      card={UserCard}
    />
  </Modal>

SharedModal.propTypes = {
  entryId: T.string.isRequired,
  shareEntry: T.func.isRequired
}

export {
  SharedModal
}
