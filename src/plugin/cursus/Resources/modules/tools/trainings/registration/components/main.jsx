import React from 'react'

import {trans} from '#/main/app/intl'
import {Routes} from '#/main/app/router'
import {ToolPage, selectors as toolSelectors} from '#/main/core/tool'
import {useSelector} from 'react-redux'
import {TrainingsRegistrationSessions} from '#/plugin/cursus/tools/trainings/registration/components/sessions'

const TrainingsRegistration = (props) => {
  const toolPath = useSelector(toolSelectors.path)

  return (
    <ToolPage title={trans('registrations', {}, 'cursus')}>
      <Routes
        path={toolPath+'/registrations'}
        routes={[
          {
            path: '/sessions',
            component: TrainingsRegistrationSessions
          }, {
            path: '/events',
            component: TrainingsRegistrationSessions
          }
        ]}
      />
    </ToolPage>
  )
}

export {
  TrainingsRegistration
}
