import {createElement, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

const CreationModal = (props) => {
  const [step, setCurrentStep] = useState(get(props.steps, '[0].name', null))
  let currentStep
  if (step) {
    currentStep = props.steps.find(s => s.name === step)
  }

  if (!currentStep) {
    return null
  }

  const stepProps = merge({}, omit(props, 'title', 'steps'), {
    icon: undefined,
    title: props.title,
    subtitle: currentStep.title,
    changeStep: setCurrentStep,
    // previousAction
  })

  if (currentStep.render) {
    return currentStep.render(stepProps)
  }

  return createElement(currentStep.component, stepProps)
}

CreationModal.propTypes = {
  title: T.string,
  steps: T.arrayOf(T.shape({
    name: T.string.isRequired,
    title: T.string,
    component: T.node,
    render: T.func
  }))
}

export {
  CreationModal
}
