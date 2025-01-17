import {createSelector} from 'reselect'
import get from 'lodash/get'

import {selectors as formSelectors} from '#/main/app/content/form'

import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store'
import {constants} from '#/main/evaluation/sequence/constants'

const STORE_NAME = 'sequenceEditor'

/**
 * Get the path of the current sequence editor.
 * Used to create additional routing in the editor.
 */
const path = createSelector(
  [sequenceSelectors.path],
  (sequencePath) => sequencePath + '/edit'
)

const errors = (state) => formSelectors.errors(formSelectors.form(state, STORE_NAME))
const data = (state) => formSelectors.data(formSelectors.form(state, STORE_NAME))

const workspace = createSelector(
  [data],
  (data) => data.workspace
)

const workspaceId = createSelector(
  [workspace],
  (workspace) => workspace.id
)

const steps = createSelector(
  [data],
  (path) => path.steps || []
)

const numbering = createSelector(
  [data],
  (path) => get(path, 'display.numbering')
)

const hasCustomNumbering = createSelector(
  [numbering],
  (numbering) => numbering === constants.NUMBERING_CUSTOM
)

export const selectors = {
  STORE_NAME,
  path,
  errors,
  data,
  workspace,
  workspaceId,
  steps,
  numbering,
  hasCustomNumbering
}
