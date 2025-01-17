import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {PageContent, PageSection} from '#/main/app/page'
import {ContentMenu} from '#/main/app/content/components/menu'
import {ToolPage} from '#/main/core/tool'

const TemplateList = (props) => {
  const types = props.templateTypes[props.type] || []

  return (
    <ToolPage
      title={trans(props.type)}
    >
      <PageContent>
        <PageSection size="md">
          <p className="mt-5 mb-4 text-center lead">
            {trans('configure_'+props.type+'_help', {}, 'template')}
          </p>

          <ContentMenu
            className="mb-5"
            autoFocus={false}
            items={types
              .map(type => ({
                id: type,
                label: trans(type, {}, 'template'),
                description: trans(type+'_desc', {}, 'template'),
                action: {
                  type: LINK_BUTTON,
                  target: `${props.path}/${props.type}/${type}`
                }
              }))
              .sort((a, b) => {
                if (a.label > b.label) {
                  return 1
                }

                return -1
              })
            }
          />
        </PageSection>
      </PageContent>
    </ToolPage>
  )
}

TemplateList.propTypes = {
  path: T.string.isRequired,
  type: T.oneOf(['email', 'pdf', 'sms'])
}

export {
  TemplateList
}
