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
import {getAccount} from '#/main/community/user/utils'

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
      //onSave={props.refresh}
      target={['apiv2_user_update', {
        id: get(props.formData, 'id')
      }]}
      canAdministrate={props.formData && hasPermission('administrate', props.formData)}
      close={route(props.formData)}
      overviewPage={UserEditorOverview}
      //appearancePage={props.appearancePage}
      historyPage={UserEditorHistory}
      actionsPage={UserEditorActions}
      permissionsPage={UserEditorPermissions}
      defaultPage="overview"
      pages={[
        {
          name: 'locale',
          title: trans('Langue', {}, 'tools'),
          help: trans('Choisissez la langue et le format de date à utiliser dans votre compte.'),
          component: UserEditorIntl,
          group: trans('preferences')
        }, {
          name: 'notifications',
          title: trans('Notifications', {}, 'tools'),
          help: trans('Choisissez la langue et le format de date à utiliser dans votre compte.'),
          component: UserEditorNotifications,
          group: trans('preferences')
        }, {
          name: 'favorites',
          title: trans('favourites', {}, 'favourite'),
          help: trans('Ajoutez des champs personnalisés pour enrichir le profil de vos utilisateurs.'),
          component: (<></>),
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

UserEditor.defaultProps = {

}

export {
  UserEditor
}
