import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {Editor} from '#/main/app/editor/components/main'

import {User as UserTypes} from '#/main/community/user/prop-types'
import {route} from '#/main/community/user/routing'
import {selectors} from '#/main/community/user/editor/store'
import {UserEditorOverview} from '#/main/community/user/editor/components/overview'
import {UserEditorActions} from '#/main/community/user/editor/components/actions'
import {UserEditorPermissions} from '#/main/community/user/editor/components/permissions'
import {UserEditorHistory} from '#/main/community/user/editor/components/history'
import {UserEditorIntl} from '#/main/community/user/editor/components/intl'
import {UserEditorNotifications} from '#/main/community/user/editor/components/notifications'
import {UserEditorFavourites} from '#/main/community/user/editor/components/favourites'
import {getAccount} from '#/main/community/user/utils'
import {Thumbnail} from '#/main/app/components/thumbnail'

const UserEditor = (props) => {
  const [accountPages, setAccountPages] = useState([])

  useEffect(() => {
    if (props.username) {
      props.open(props.username)

      getAccount().then(accountPages => setAccountPages(accountPages))
    }
  }, [props.username])

  return (
    <Editor
      path={props.path}
      title={get(props.formData, 'name') || trans('user')}
      name={selectors.FORM_NAME}
      thumbnail={
        <Thumbnail
          className="mx-auto"
          thumbnail={get(props.formData, 'picture')}
          name={get(props.formData, 'name')}
          size="md"
          square={true}
        />
      }
      //onSave={props.refresh}
      target={['apiv2_user_update', {
        id: get(props.formData, 'id')
      }]}
      canAdministrate={props.formData && hasPermission('administrate', props.formData)}
      close={route(props.formData)}
      overviewPage={UserEditorOverview}
      historyPage={UserEditorHistory}
      actionsPage={UserEditorActions}
      permissionsPage={UserEditorPermissions}
      pages={[
        {
          name: 'locale',
          title: trans('Langue', {}, 'tools'),
          component: UserEditorIntl,
          group: trans('preferences')
        }, {
          name: 'notifications',
          title: trans('Notifications', {}, 'tools'),
          component: UserEditorNotifications,
          group: trans('preferences')
        }, {
          name: 'favourites',
          title: trans('favourites', {}, 'workspace'),
          component: UserEditorFavourites,
          group: trans('preferences')
        }
      ].concat(accountPages)}
    />
  )
}

UserEditor.propTypes = {
  username: T.string.isRequired,
  formData: T.shape(
    UserTypes.propTypes
  ),
  open: T.func.isRequired
}

export {
  UserEditor
}
