import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {CreationType} from '#/main/core/workspace/modals/creation/components/type'
import {CreationInfo} from '#/main/core/workspace/modals/creation/components/info'
import {CreationUpload} from '#/main/core/workspace/modals/creation/components/upload'

const CreationModal = (props) => {
  const [currentStep, setCurrentStep] = useState('type')

  const create = () => props.create().then(response => {
    props.fadeModal()

    if (props.onCreate) {
      props.onCreate(response)
    }

    return response
  })

  let StepComponent
  switch (currentStep) {
    case 'type':
      StepComponent = (
        <CreationType
          startCreation={props.startCreation}
          changeStep={setCurrentStep}
        />
      )
      break

    case 'upload':
      StepComponent = (
        <CreationUpload
          changeStep={setCurrentStep}
          create={create}
        />
      )
      break

    case 'info':
      StepComponent = (
        <CreationInfo
          create={create}
          changeStep={setCurrentStep}
        />
      )
      break
  }

  return (
    <Modal
      {...omit(props, 'create', 'onCreate', 'startCreation', 'reset')}
      title={trans('new_workspace', {}, 'workspace')}
      subtitle={trans('L\'espace d\'activités est au coeur de votre formation.')}
      centered={true}
      onExited={props.reset}
    >
      {StepComponent}
    </Modal>
  )
}

CreationModal.propTypes = {
  startCreation: T.func.isRequired,
  create: T.func.isRequired,
  onCreate: T.func,
  reset: T.func.isRequired
}

export {
  CreationModal
}
