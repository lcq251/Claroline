import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'

import {Privacy} from '#/main/privacy/components/privacy'

const PrivacyMain = () =>
  <EditorPage
    title={trans('privacy_policy', {}, 'privacy')}
  >
    <Privacy />
  </EditorPage>

export {
  PrivacyMain
}
