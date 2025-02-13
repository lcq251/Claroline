import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'

import {selectors} from '#/main/log/administration/logs/store/selectors'
import {LogOperationalList} from '#/main/log/components/operational-list'

const LogsOperational = () =>
  <ToolPage>
    <PageListSection
      title={trans('operational', {}, 'log')}
    >
      <LogOperationalList
        className="mb-5"
        flush={true}
        name={selectors.OPERATIONAL_NAME}
        url={['apiv2_logs_operational']}
        customDefinition={[
          {
            name: 'objectClass',
            type: 'string',
            label: trans('object'),
            displayed: true
          }, {
            name: 'objectId',
            type: 'string',
            label: trans('id'),
            displayed: true
          }
        ]}
      />
    </PageListSection>
  </ToolPage>

export {
  LogsOperational
}
