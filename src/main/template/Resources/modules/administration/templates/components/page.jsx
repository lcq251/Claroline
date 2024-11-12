import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'

const TemplatePage = (props) => {
  return (
    <ToolPage
      breadcrumb={[
        {
          type: LINK_BUTTON,
          label: trans(get(props.templateType, 'type')),
          target: props.path + '/' + get(props.templateType, 'type')
        }, {
          type: LINK_BUTTON,
          label: trans(get(props.templateType, 'name'), {}, 'template'),
          target: props.path + '/' + get(props.templateType, 'type') + '/' + get(props.templateType, 'name')
        }
      ]}
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
      {props.children}
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
