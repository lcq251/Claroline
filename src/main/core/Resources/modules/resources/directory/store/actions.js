import {API_REQUEST} from '#/main/app/api'

// action creators
export const actions = {}

actions.uploadFiles = (parent, files) => {
  const formData = new FormData()
  files.forEach((file, index) => formData.append(index, file))

  return ({
    [API_REQUEST]: {
      url: ['claro_resource_upload', {parentId: parent.id}],
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
