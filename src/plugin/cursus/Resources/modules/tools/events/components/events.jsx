import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ToolPage} from '#/main/core/tool'

import {EventList} from '#/plugin/cursus/event/components/list'
import {selectors} from '#/plugin/cursus/tools/events/store'
import {PageListSection} from '#/main/app/page/components/list-section'

const Events = (props) =>
  <ToolPage
    title={props.title}
  >
    <PageListSection>
      <EventList
        className="mb-5"
        flush={true}
        path={props.path}
        name={selectors.LIST_NAME}
        url={props.url}
      />
    </PageListSection>
  </ToolPage>

Events.propTypes = {
  path: T.string.isRequired,
  title: T.string.isRequired,
  url: T.oneOfType([T.array, T.string]).isRequired
}

export {
  Events
}
