import {createSelector} from 'reselect'
import get from 'lodash/get'

import {selectors as toolSelectors} from '#/main/core/tool'

import {constants} from '#/main/evaluation/constants'
import {route} from '#/main/evaluation/sequence'
import {selectors as contextSelectors} from '#/main/app/context'

const STORE_NAME = 'evaluationSequence'

const store = (state) => state[STORE_NAME] || {}

const data = createSelector(
  [store],
  (store) => store.data
)

const sequence = createSelector(
  [data],
  (data) => data.sequence
)

const workspace = createSelector(
  [sequence],
  (sequence) => sequence ? sequence.workspace : null
)

const path = createSelector(
  [toolSelectors.path, sequence],
  (basePath, sequence) => {
    return route(sequence, null, basePath)
  }
)

const id = createSelector(
  [sequence],
  (sequence) => sequence.id
)

const steps = createSelector(
  [sequence],
  (sequence) => sequence.steps || []
)

const empty = createSelector(
  [steps],
  (steps) => 0 === steps.length
)

// is step navigation enabled ?
const navigationEnabled = createSelector(
  [store],
  (store) => store.navigationEnabled
)

const stepsProgression = createSelector(
  [data],
  (data) => data.stepsProgression
)

const evaluation = createSelector(
  [data],
  (data) => data.userEvaluation
)

// evaluation for the required resource of the path
const resourceEvaluations = createSelector(
  [data],
  (data) => data.resourceEvaluations
)

const userFeedback = createSelector(
  [sequence, evaluation],
  (sequence, evaluation) => {
    switch (evaluation.status) {
      case constants.EVALUATION_STATUS_COMPLETED:
        return get(sequence, 'evaluation.endMessage', null)
      case constants.EVALUATION_STATUS_PASSED:
        return get(sequence, 'evaluation.successMessage', null) || get(sequence, 'evaluation.endMessage', null)
      case constants.EVALUATION_STATUS_FAILED:
        return get(sequence, 'evaluation.failedMessage', null) || get(sequence, 'evaluation.endMessage', null)
      default:
        return null
    }
  }
)

const totalScore = createSelector(
  [sequence],
  (sequence) => get(sequence, 'evaluation.scoreTotal', null)
)

const hasScore = createSelector(
  [totalScore],
  (totalScore) => !!totalScore
)

export const selectors = {
  STORE_NAME,

  sequence,
  workspace,
  path,
  id,
  steps,
  empty,
  navigationEnabled,
  evaluation,
  resourceEvaluations,
  stepsProgression,
  userFeedback,
  hasScore,
  totalScore
}
