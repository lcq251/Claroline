import {connect} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {withReducer} from '#/main/app/store/components/withReducer'

import {selectors as resourceSelect} from '#/main/core/resource/store'

import {reducer, selectors} from '#/plugin/scorm/resources/scorm/store'
import {ScormResource as ScormResourceComponent} from '#/plugin/scorm/resources/scorm/components/resource'

const ScormResource = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      scorm: selectors.scorm(state),
      editable: hasPermission('edit', resourceSelect.resourceNode(state))
    })
  )(ScormResourceComponent)
)

export {
  ScormResource
}
