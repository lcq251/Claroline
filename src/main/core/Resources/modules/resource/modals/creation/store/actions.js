import merge from 'lodash/merge'

import {makeId} from '#/main/app/utils/id'
import {actions as formActions} from '#/main/app/content/form/store/actions'

import {getResource} from '#/main/core/resources'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {selectors} from '#/main/core/resource/modals/creation/store/selectors'
import {API_REQUEST} from '#/main/app/api'

export const actions = {}

/**
 * Starts the creation of the selected resource type.
 * It initializes the new resource node with the default & parent values.
 *
 * @param {object} parent       - the parent of the new resource
 * @param {string} resourceType - the type of resource to create
 * @param {object} nodeData     - the initial data of the node to create
 * @param {object} resourceData - the initial data of the resource to create
 */
actions.startCreation = (parent, resourceType, nodeData = {}, resourceData = {}) => (dispatch) => {
  let defaultData = {
    resource: resourceData,
    resourceNode: merge({}, ResourceNodeTypes.defaultProps, {
      id: makeId(),
      workspace: parent.workspace,
      meta: {
        mimeType: `custom/${resourceType}`,
        type: resourceType
      },
      rights: parent.rights
    }, nodeData)
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

actions.fromFile = (file) => (dispatch) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', file.name)
  formData.append('sourceType', 'uploadedfile')

  return dispatch({
    [API_REQUEST]: {
      url: ['claro_resource_check_file'],
      type: 'upload',
      request: {
        method: 'POST',
        body: formData,
        headers: new Headers({
          //no Content type for automatic detection of boundaries.
          'X-Requested-With': 'XMLHttpRequest'
        })
      }
    }
  })
}

actions.fromUrl = (url) => (dispatch) => dispatch({
  [API_REQUEST]: {
    url: ['claro_resource_check_url'],
    type: 'upload',
    request: {
      method: 'POST',
      body: JSON.stringify([url])
    }
  }
})
