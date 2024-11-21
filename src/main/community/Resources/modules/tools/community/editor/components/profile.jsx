import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'
import {FormParameters} from '#/main/app/content/form/parameters/containers/main'

import {selectors} from '#/main/community/tools/community/editor/store'

const CommunityEditorProfile = () => {
  const editedProfile = useSelector(selectors.formProfile)

  return (
    <EditorPage
      title={trans('user_profile')}
      help={trans('Ajoutez des champs personnalisés pour enrichir le profil de vos utilisateurs.')}
    >
      <FormParameters
        name={selectors.FORM_NAME}
        dataPart="profile.sections"
        sections={get(editedProfile, 'sections', [])}
      />
    </EditorPage>
  )
}

export {
  CommunityEditorProfile
}
