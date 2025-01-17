import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {URL_BUTTON} from '#/main/app/buttons'

import {BBB as BBBTypes} from '#/integration/big-blue-button/resources/bbb/prop-types'
import {selectors} from '#/integration/big-blue-button/resources/bbb/records/store/selectors'
import {Recordings} from '#/integration/big-blue-button/components/recordings'
import {ResourcePage} from '#/main/core/resource'
import {PageContent} from '#/main/app/page'

const Records = props =>
  <ResourcePage
    title={trans('recordings', {}, 'bbb')}
  >
    <PageContent>
      <Recordings
        name={selectors.LIST_NAME}
        url={['apiv2_bbb_meeting_recordings_list', {id: props.bbb.id}]}
        delete={['apiv2_bbb_meeting_recording_delete', {id: props.bbb.id}]}
        primaryAction={(row) => ({
          type: URL_BUTTON,
          label: trans('open', {}, 'actions'),
          target: get(row, 'medias.presentation', '')
        })}
        customDefinition={[]}
      />
    </PageContent>
  </ResourcePage>

Records.propTypes = {
  path: T.string.isRequired,
  bbb: T.shape(
    BBBTypes.propTypes
  )
}

export {
  Records
}