import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {LogOperationalList} from '#/main/log/components/operational-list'
import {selectors} from '#/main/community/user/editor/store'

const UserEditorHistory = () => {
  const userId = useSelector(selectors.userId)

  return (
    <EditorPage
      title={trans('history')}
      help={trans('user_history_desc', {}, 'community')}
    >
      <LogOperationalList
        autoload={!!userId}
        url={['apiv2_logs_operational_object', {objectId: userId, objectName: 'Claroline/CoreBundle/Entity/User'}]}
      />
    </EditorPage>
  )
}

export {
  UserEditorHistory
}
