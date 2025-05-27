import React from 'react'
import {PropTypes as T} from 'prop-types'
import SwaggerUI from 'swagger-ui-react'

import {url} from '#/main/app/api/router'
import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {PageContent, PageSection} from '#/main/app/page'

const ApiAdministration = (props) =>
  <ToolPage
    title={trans('api', {}, 'integration')}
  >
    <PageContent>
      <PageSection size="full" className="pt-5 pb-4">
        <SwaggerUI
          filter={true}
          url={url(['claro_documentation'])}
        />
      </PageSection>
    </PageContent>
  </ToolPage>

ApiAdministration.propTypes = {
  path: T.string.isRequired
}

export {
  ApiAdministration
}
