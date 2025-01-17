import React from 'react'
import {PropTypes as T} from 'prop-types'
import SwaggerUI from 'swagger-ui-react'

import {url} from '#/main/app/api/router'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {PageContent} from '#/main/app/page'

const ApiAdministration = (props) =>
  <ToolPage
    breadcrumb={[{
      type: LINK_BUTTON,
      label: trans('api', {}, 'integration'),
      target: `${props.path}/api`
    }]}
    title={trans('api', {}, 'integration')}
  >
    <PageContent>
      <SwaggerUI
        url={url(['apiv2_swagger_get'])}
      />
    </PageContent>
  </ToolPage>

ApiAdministration.propTypes = {
  path: T.string.isRequired
}

export {
  ApiAdministration
}
