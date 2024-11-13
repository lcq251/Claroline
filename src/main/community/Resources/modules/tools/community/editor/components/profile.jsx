import React, {useEffect} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'
import {ContentNav} from '#/main/app/content/components/nav'

import {EditorFacet} from '#/main/community/tools/community/editor/components/facet'
import {getDefaultFacet} from '#/main/community/profile/utils'
import {EditorPage} from '#/main/app/editor'
import {FormParameters} from '#/main/app/content/form/parameters/containers/main'
import {selectors} from '#/main/community/tools/community/editor/store'

const EditorProfile = props => {
  useEffect(() => {
    if (props.loaded) {
      // load tool parameters inside the form
      props.load(props.profile)
    }
  }, [props.contextType, props.contextId, props.loaded])

  return (
    <EditorPage
      title={trans('user_profile')}
      help={trans('Ajoutez des champs personnalisés pour enrichir le profil de vos utilisateurs.')}
    >
      <FormParameters
        name={selectors.FORM_NAME}
        dataPart="profile.sections"
        sections={get(props.formProfile, 'sections', [])}
      />
    </EditorPage>
  )
}

EditorProfile.propTypes = {
  path: T.string.isRequired,
  loaded: T.bool.isRequired,
  contextType: T.string.isRequired,
  contextId: T.string,
  formProfile: T.object,
  load: T.func.isRequired
}

export {
  EditorProfile
}
