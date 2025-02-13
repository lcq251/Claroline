import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'

import {selectors} from '#/main/log/administration/logs/store/selectors'
import {LogSecurityList} from '#/main/log/components/security-list'

const LogsSecurity = () =>
  <ToolPage>
    <PageListSection
      title={trans('security', {}, 'log')}
    >
      <LogSecurityList
        className="mb-5"
        name={selectors.LIST_NAME}
        url={['apiv2_logs_security']}
        customDefinition={[
          {
            name: 'target',
            type: 'user',
            label: trans('target'),
            displayed: false
          }
        ]}
      />
    </PageListSection>
  </ToolPage>

export {
  LogsSecurity
}
