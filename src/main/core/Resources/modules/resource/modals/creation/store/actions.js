import merge from 'lodash/merge'

import {makeId} from '#/main/core/scaffolding/id'
import {actions as formActions} from '#/main/app/content/form/store/actions'

import {getResource} from '#/main/core/resources'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {selectors} from '#/main/core/resource/modals/creation/store/selectors'

// action creators
export const actions = {}

/**
 * Starts the creation of the selected resource type.
 * It initializes the new resource node with the default & parent values.
 *
 * @param {object} parent       - the parent of the new resource
 * @param {string} resourceType - the type of resource to create
 * @param {object} resourceData - the initial data of resource to create
 */
actions.startCreation = (parent, resourceType, resourceData = {}) => (dispatch) => {
  let defaultData = {
    resource: null,
    resourceNode: merge({}, ResourceNodeTypes.defaultProps, resourceData, {
      id: makeId(),
      workspace: parent.workspace,
      meta: {
        mimeType: `custom/${resourceType}`,
        type: resourceType,
        //creator: securitySelectors.currentUser(getState()),
        published: false
      },
      restrictions: parent.restrictions,
      rights: parent.rights
    })
  }

  // let the plugin add some changes to init data if it wants to
  return getResource(resourceType).then(module => {
    if (module.default && module.default.create) {
      // plugin wants to customize init data
      defaultData = module.default.create(defaultData)
    }

    // fill form reducer with new data
    dispatch(formActions.resetForm(selectors.STORE_NAME, defaultData, true))
  })
}

actions.reset = () => formActions.resetForm(selectors.STORE_NAME, {resource: {}, resourceNode: {}}, true)

/**
 * Shortcut to update the new node.
 *
 * @param {string} prop  - the name of the node's prop to update
 * @param {*}      value - the new value for the node's prop
 */
actions.updateNode = (prop, value) => formActions.updateProp(selectors.STORE_NAME, `${selectors.FORM_NODE_PART}.${prop}`, value)

/**
 * Shortcut to update the new resource.
 *
 * @param {string} prop  - the name of the resource's prop to update
 * @param {*}      value - the new value for the resource's prop
 */
actions.updateResource = (prop, value) => formActions.updateProp(selectors.STORE_NAME, prop ? `${selectors.FORM_RESOURCE_PART}.${prop}`:selectors.FORM_RESOURCE_PART, value)

/**
 * Saves the new resource.
 *
 * @param {object} parent - the parent of the new resource
 */
actions.create = (parent) => formActions.saveForm(selectors.STORE_NAME, ['claro_resource_action', {
  action: 'add',
  id: parent.id
}])
