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
          <p className="my-5 text-center lead">
            {trans('configure_'+props.type+'_help', {}, 'template')}
          </p>

          <ContentMenu
            className="mb-5"
            autoFocus={false}
            search={true}
            items={types
              .map(type => ({
                id: type.name,
                label: trans(type.name, {}, 'template'),
                action: {
                  type: LINK_BUTTON,
                  target: `${props.path}/${props.type}/${type.name}`
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
