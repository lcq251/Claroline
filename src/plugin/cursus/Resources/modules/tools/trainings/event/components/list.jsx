import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'

import {EventList} from '#/plugin/cursus/event/components/list'
import {selectors} from '#/plugin/cursus/tools/trainings/event/store'
import {PageListSection} from '#/main/app/page/components/list-section'

const EventsList = (props) =>
  <ToolPage
    title={props.title}
  >
    <PageListSection>
      <EventList
        className="mb-5"
        flush={true}
        path={props.path}
        name={selectors.STORE_NAME}
        url={props.url}
        customDefinition={[
          {
            name: 'session',
            label: trans('session', {}, 'cursus'),
            type: 'training_session',
            displayed: true
          }
        ]}
      />
    </PageListSection>
  </ToolPage>

EventsList.propTypes = {
  path: T.string.isRequired,
  title: T.string.isRequired,
  url: T.oneOfType([T.array, T.string]).isRequired
}

export {
  EventsList
}
