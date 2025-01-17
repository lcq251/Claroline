import {createSelector} from 'reselect'
import get from 'lodash/get'

import {selectors as toolSelectors} from '#/main/core/tool'

import {route} from '#/main/evaluation/sequence'

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

const showOverview = createSelector(
  [sequence],
  (sequence) => get(sequence, 'overview.display') || false
)

const showEndPage = createSelector(
  [sequence],
  (sequence) => get(sequence, 'end.display') || false
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

export const selectors = {
  STORE_NAME,

  sequence,
  path,
  id,
  steps,
  empty,
  navigationEnabled,
  showOverview,
  showEndPage,
  evaluation,
  resourceEvaluations,
  stepsProgression
}
