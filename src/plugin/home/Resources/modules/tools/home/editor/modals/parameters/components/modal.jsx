import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Modal} from '#/main/app/overlays/modal/components/modal'

import {selectors} from '#/plugin/home/tools/home/editor/modals/parameters/store'
import {Tab as TabTypes} from '#/plugin/home/prop-types'
import {TabForm} from '#/plugin/home/tools/home/editor/components/form'

const ParametersModal = props =>
  <Modal
    {...omit(props, 'currentContext', 'save', 'tab', 'loadTab')}
    title={trans('page', {}, 'home')}
    onEntering={() => props.loadTab(props.tab)}
  >
    <TabForm
      name={selectors.STORE_NAME}
      currentContext={props.currentContext}
      isNew={false}
      onSave={(formData) => {
        props.save(formData)
        props.fadeModal()
      }}
    />
  </Modal>

ParametersModal.propTypes = {
  currentContext: T.shape({
    type: T.string.isRequired,
    data: T.object
  }).isRequired,
  tab: T.shape(
    TabTypes.propTypes
  ).isRequired,
  loadTab: T.func.isRequired,
  save: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  ParametersModal
}
