import React from 'react'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {now, trans} from '#/main/app/intl'
import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as contextSelectors} from '#/main/app/context/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {EventList} from '#/plugin/agenda/event/components/list'
import {route} from '#/plugin/agenda/event/routing'
import {selectors} from '#/plugin/agenda/tools/agenda/store'

import {MODAL_EVENT_CREATION} from '#/plugin/agenda/event/modals/creation'

const AgendaList = () => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const contextType = useSelector(contextSelectors.type)
  const contextData = useSelector(contextSelectors.data)
  const toolPath = useSelector(toolSelectors.path)

  return (
    <ToolPage title={trans('all_events', {}, 'agenda')}>
      <PageListSection>
        <EventList
          flush={true}
          name={selectors.STORE_NAME+'.list'}
          url={['apiv2_planned_object_planning_list', {planningId: (contextData && contextData.id) || currentUser.id}]}
          primaryAction={(row) => ({
            type: LINK_BUTTON,
            target: route(row, toolPath)
          })}
          addAction={{
            type: MODAL_BUTTON,
            label: trans('add-event', {}, 'actions'),
            modal: [MODAL_EVENT_CREATION, {
              event: {
                start: now(false),
                workspace: !isEmpty(contextData) ? contextData : null
              },
              onSave: () => true // TODO invalidate
            }],
            displayed: !isEmpty(currentUser)
          }}
          customDefinition={'desktop' === contextType ? [
            {
              name: 'workspace',
              type: 'workspace',
              label: trans('workspace'),
              displayed: true,
              filterable: false,
              sortable: false
            }
          ] : []}
        />
      </PageListSection>
    </ToolPage>
  )
}

export {
  AgendaList
}
