import {getActions as getPluginsActions, getDefaultAction as getPluginsDefaultAction} from '#/main/app/plugins'

import {constants} from '#/main/evaluation/sequence/constants'

function getActions(sequences, refresher = {}, path, currentUser = null, withDefault = false) {
  return Promise.all([
    getPluginsActions('sequence', sequences, refresher, path, currentUser, withDefault),
    getPluginsActions('sequence', sequences, refresher, path, currentUser, withDefault)
  ]).then((loadedActions) => loadedActions.reduce((current, acc) => acc.concat(current), []))
}

function getDefaultAction(sequence, refresher = {}, path, currentUser = null) {
  return getActions([sequence], refresher, path, currentUser, true)
    // only get the default one
    .then(actions => actions.find(action => action.default))
}

function getEvaluationActions(evaluations, refresher, path, currentUser, withDefault = false) {
  return getPluginsActions('sequence_evaluation', evaluations, refresher, path, currentUser, withDefault)
}

function getEvaluationDefaultAction(evaluation, refresher, path, currentUser = null) {
  return getPluginsDefaultAction('sequence_evaluation', evaluation, refresher, path, currentUser)
}

/**
 * Flattens a tree of steps into a one-level array.
 *
 * @param {Array}  steps
 */
function flattenSteps(steps) {
  function flatten(step, parent = null) {
    const children = step.children
    const flatStep = Object.assign({}, step)

    delete flatStep.children
    if (parent) {
      flatStep.parent = {
        id: parent.id,
        title: parent.title
      }
    }

    let flattened = [flatStep]

    if (children) {
      children.map((child) => {
        flattened = flattened.concat(flatten(child, flatStep))
      })
    }

    return flattened
  }

  return steps.reduce((acc, step) => acc.concat(flatten(step)), [])
}

/**
 * Get the display numbering of a step.
 *
 * @param {string} type
 * @param {Array} steps
 * @param {Step.propTypes} step
 *
 * @return {string}
 */
function getNumbering(type, steps, step) {
  function buildPath(steps, step) {
    let stepPath = []

    steps.map((s, i) => {
      if (s.id === step.id) {
        stepPath.push(i) // add current step to the path
      } else if (s.children && 0 !== s.children.length) {
        const subPath = buildPath(s.children, step)
        if (0 !== subPath.length) {
          stepPath = stepPath.concat([i], subPath)
        }
      }
    })

    return stepPath
  }

  switch (type) {
    /**
     * The numbering label is a number.
     */
    case constants.NUMBERING_NUMERIC:
      return '' + buildPath(steps, step)
        // make numbering start to 1 for users
        .map(i => i + 1)
        .join('.') + '.'

    /**
     * The numbering label is a letter.
     */
    case constants.NUMBERING_LITERAL:
      return buildPath(steps, step)
        // get correct letter
        .map(i => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i])
        .join('.') + '.'

    /**
     * The numbering label is specified by each step.
     */
    case constants.NUMBERING_CUSTOM:
      return step.display.numbering || ''

    /**
     * The numbering feature is disabled.
     */
    case constants.NUMBERING_NONE:
    default:
      return ''
  }
}

function getNext(steps, current) {
  const currentIndex = steps.findIndex(step => current.id === step.id)

  let next
  if (steps.length > currentIndex + 1) {
    next = steps[currentIndex + 1]
  }

  return next
}

function getPrevious(steps, current) {
  const currentIndex = steps.findIndex(step => current.id === step.id)

  let previous
  if (0 !== currentIndex) {
    previous = steps[currentIndex - 1]
  }

  return previous
}

export {
  getActions,
  getDefaultAction,
  getEvaluationActions,
  getEvaluationDefaultAction,
  flattenSteps,
  getNumbering,
  getPrevious,
  getNext
}
