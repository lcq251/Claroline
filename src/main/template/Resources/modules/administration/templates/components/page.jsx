import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {PageContent} from '#/main/app/page'

const TemplatePage = (props) => {
  return (
    <ToolPage
      title={trans(get(props.templateType, 'name'), {}, 'template')}
      description={trans(get(props.templateType, 'description'), {}, 'template')}
    >
      <PageContent>
        {props.children}
      </PageContent>
    </ToolPage>
  )
}

TemplatePage.propTypes = {
  path: T.string.isRequired,
  templateType: T.shape({
    // TemplateTypeTypes.propTypes
  }),
  children: T.any
}

export {
  TemplatePage
}
