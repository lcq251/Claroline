import React from 'react'
import {useSelector} from 'react-redux'

import {selectors as toolSelectors, ToolOverview} from '#/main/core/tool'

import {TrainingsRegistrationsPending} from '#/plugin/cursus/tools/trainings/components/registrations-pending'
import {TrainingsRegistrationsConfirm} from '#/plugin/cursus/tools/trainings/components/registrations-confirm'
import {TrainingsRegistrationsFull} from '#/plugin/cursus/tools/trainings/components/registrations-full'

const TrainingsOverview = () => {
  const toolPath = useSelector(toolSelectors.path)
  const contextType = useSelector(toolSelectors.contextType)

  return (
    <ToolOverview>
      <TrainingsRegistrationsFull contextType={contextType} path={toolPath} />
      <TrainingsRegistrationsConfirm contextType={contextType} path={toolPath} />
      <TrainingsRegistrationsPending contextType={contextType} path={toolPath} />
    </ToolOverview>
  )
}

export {
  TrainingsOverview
}
