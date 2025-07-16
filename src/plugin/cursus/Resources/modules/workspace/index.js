import {TrainingWorkspaceRestrictions} from '#/plugin/cursus/workspace/components/restrictions'

/**
 * Adds a page to register to the parent training if the workspace is linked to one.
 */
export default (workspace, errors) => ({
  component: TrainingWorkspaceRestrictions,
  displayed: !!errors.trainings, // only display the restriction if there is training info
  order: 0
})
