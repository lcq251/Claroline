import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {PageContent} from '#/main/app/page'

const TemplatePage = (props) => {
  return (
    <ToolPage
      title={trans(get(props.templateType, 'name'), {}, 'template')}
      description={trans(get(props.templateType, 'description'), {}, 'template')}

      primaryAction="add"
      actions={[
        {
          name: 'add',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-plus',
          label: trans('add_template'),
          target: `${props.path}/${props.templateType.type}/${props.templateType.id}/form`,
          primary: true,
          exact: true
        }
      ]}
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
