import React from 'react'
import {useSelector} from 'react-redux'

import {Routes} from '#/main/app/router'
import {selectors as toolSelectors} from '#/main/core/tool'

import {TrainingsRegistrationSessions} from '#/plugin/cursus/tools/trainings/registration/components/sessions'
import {TrainingsRegistrationEvents} from '#/plugin/cursus/tools/trainings/registration/components/events'

const TrainingsRegistration = () => {
  const toolPath = useSelector(toolSelectors.path)

  return (
    <Routes
      path={toolPath+'/registrations'}
      redirect={[
        {from: '/', exact: true, to: '/session'}
      ]}
      routes={[
        {
          path: '/session',
          component: TrainingsRegistrationSessions
        }, {
          path: '/event',
          component: TrainingsRegistrationEvents
        }
      ]}
    />
  )
}

export {
  TrainingsRegistration
}
