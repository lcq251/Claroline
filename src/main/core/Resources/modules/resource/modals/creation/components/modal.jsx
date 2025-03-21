import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Modal} from '#/main/app/overlays/modal/components/modal'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'

import {CreationInfo} from '#/main/core/resource/modals/creation/components/info'
import {CreationStart} from '#/main/core/resource/modals/creation/components/start'
import {CreationType} from '#/main/core/resource/modals/creation/components/type'
import {CreationUpload} from '#/main/core/resource/modals/creation/components/upload'
import {CreationUrl} from '#/main/core/resource/modals/creation/components/url'

const ResourceCreationModal = (props) => {
  const [currentStep, setCurrentStep] = useState('start')

  let StepComponent
  switch (currentStep) {
    case 'start':
      StepComponent = (
        <CreationStart
          contextId={get(props.parent, 'workspace.id', null)}
          changeStep={setCurrentStep}
          startCreation={(type, nodeData, resourceData) => props.startCreation(props.parent, type, nodeData, resourceData).then(() => {
            setCurrentStep('info')
          })}
        />
      )
      break

    case 'type':
      StepComponent = (
        <CreationType
          types={props.parent.permissions.create}
          changeStep={setCurrentStep}
          startCreation={(type, resourceData) => props.startCreation(props.parent, type, resourceData).then(() => {
            setCurrentStep('info')
          })}
        />
      )
      break

    case 'upload':
      StepComponent = (
        <CreationUpload
          changeStep={setCurrentStep}
          fromFile={props.fromFile}
          startCreation={(type, nodeData, resourceData) => props.startCreation(props.parent, type, nodeData, resourceData).then(() => {
            setCurrentStep('info')
          })}
        />
      )
      break

    case 'url':
      StepComponent = (
        <CreationUrl
          changeStep={setCurrentStep}
          fromUrl={props.fromUrl}
          startCreation={(type, nodeData, resourceData) => props.startCreation(props.parent, type, nodeData, resourceData).then(() => {
            setCurrentStep('info')
          })}
        />
      )
      break

    case 'info':
      StepComponent = (
        <CreationInfo
          create={() => props.create(props.parent).then(response => {
            props.add([response])
            props.fadeModal()

            return response
          })}
          changeStep={setCurrentStep}
        />
      )
      break
  }

  return (
    <Modal
      {...omit(props, 'parent', 'startCreation', 'create', 'reset', 'add', 'fromFile')}
      title={trans('new_resource', {}, 'resource')}
      subtitle={trans('new_resource_desc', {}, 'resource')}
      centered={true}
      onExited={props.reset}
    >
      {StepComponent}
    </Modal>
  )
}

ResourceCreationModal.propTypes = {
  contextId: T.string,
  parent: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired,
  add: T.func.isRequired,
  fadeModal: T.func.isRequired,

  // from redux store
  startCreation: T.func.isRequired,
  fromFile: T.func.isRequired,
  fromUrl: T.func.isRequired,
  create: T.func.isRequired,
  reset: T.func.isRequired
}

export {
  ResourceCreationModal
}
