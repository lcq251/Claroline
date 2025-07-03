import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {ToolPage} from '#/main/core/tool'
import {PageContentList} from '#/main/app/page'

import {EventUsers} from '#/plugin/cursus/event/components/users'

const TrainingsEventUsers = (props) => {
  return (
    <ToolPage title={props.title}>
      <PageContentList
        title={props.title}
      >
        <EventUsers
          className="mb-5"
          flush={true}
          path={props.path}
          name={props.name}
          url={['apiv2_training_event_user_context_list', {context: props.contextType, contextId: props.contextId}]}
          customDefinition={[
            {
              name: 'event',
              label: trans('session_event', {}, 'cursus'),
              type: 'training_event',
              displayed: true,
              filterable: true,
              sortable: true,
              order: 1
            }, {
              name: 'event.session',
              label: trans('session', {}, 'cursus'),
              type: 'training_session',
              displayed: false,
              filterable: true,
              sortable: true,
              order: 2
            }, {
              name: 'event.status',
              type: 'choice',
              label: trans('status'),
              order: 3,
              displayable: false,
              sortable: false,
              filterable: true,
              options: {
                noEmpty: true,
                choices: {
                  not_started: trans('session_not_started', {}, 'cursus'),
                  in_progress: trans('session_in_progress', {}, 'cursus'),
                  ended: trans('session_ended', {}, 'cursus'),
                  not_ended: trans('session_not_ended', {}, 'cursus')
                }
              }
            },
          ]}
        />
      </PageContentList>
    </ToolPage>
  )
}

TrainingsEventUsers.propTypes = {
  path: T.string.isRequired,
  contextType: T.string.isRequired,
  contextId: T.string.isRequired,
  title: T.string.isRequired,
  type: T.string.isRequired,
  name: T.string.isRequired,
  canRegister: T.bool.isRequired
}

export {
  TrainingsEventUsers
}
