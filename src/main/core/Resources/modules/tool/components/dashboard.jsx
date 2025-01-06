import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {PageColumnPrimary, PageColumns, PageColumnSecondary, PageSection} from '#/main/app/page'

import {ToolPage} from '#/main/core/tool/components/page'
import {selectors as toolSelectors} from '#/main/core/tool/store'

const ToolDashboard = (props) => {
  const toolName = useSelector(toolSelectors.name)

  return (
    <ToolPage title={trans('dashboard') + ' | ' + trans(toolName, {}, 'tools')}>
      <PageColumns>
        <PageColumnPrimary className="py-5">
          {props.children}
        </PageColumnPrimary>

        <PageColumnSecondary>
          <PageSection size="full" className="mt-4">
            <div className="d-flex align-items-baseline gap-3" role="presentation">
              <h2 className="page-section-title h6">{trans('recent_activity')}</h2>

              <Button
                className="btn btn-link ms-auto me-n3"
                type={CALLBACK_BUTTON}
                label={trans('see_all', {}, 'actions')}
                callback={() => true}
              >
                <span className="fa fa-arrow-right ms-2" aria-hidden={true} />
              </Button>
            </div>
          </PageSection>
        </PageColumnSecondary>
      </PageColumns>
    </ToolPage>
  )
}

export {
  ToolDashboard
}
