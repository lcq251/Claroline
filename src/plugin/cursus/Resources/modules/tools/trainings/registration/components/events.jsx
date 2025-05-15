import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ToolPage, selectors as toolSelectors} from '#/main/core/tool'
import {PageContentList} from '#/main/app/page'

import {selectors} from '#/plugin/cursus/tools/trainings/store'


import {EventUsers} from '#/plugin/cursus/event/components/users'

const TrainingsRegistrationEvents = () => {
  const path = useSelector(toolSelectors.path)

  return (
    <ToolPage title={trans('registrations', {}, 'cursus')}>
      <PageContentList
        title={trans('Inscriptions aux séances')}
      >
        <EventUsers
          className="mb-5"
          flush={true}
          path={path}
          name={selectors.STORE_NAME+'.registration.events'}
          url={['apiv2_training_event_user_list']}
          customDefinition={[
            {
              order: 0,
              name: 'event',
              label: trans('session_event', {}, 'cursus'),
              type: 'training_event',
              displayed: true,
              filterable: true,
              sortable: true
            }, {
              name: 'event.start',
              alias: 'event.startDate',
              type: 'date',
              label: trans('start_date'),
              order: 1
            }, {
              name: 'event.end',
              alias: 'event.endDate',
              type: 'date',
              label: trans('end_date'),
              order: 2
            }
          ]}
        />
      </PageContentList>
    </ToolPage>
  )
}

export {
  TrainingsRegistrationEvents
}
