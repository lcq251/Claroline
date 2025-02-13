import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'

import {EventList} from '#/plugin/cursus/event/components/list'
import {selectors} from '#/plugin/cursus/tools/events/store'

const Events = (props) =>
  <ToolPage
    title={props.title}
  >
    <PageListSection
      title={props.title}
    >
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
