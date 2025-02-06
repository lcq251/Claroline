import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Modal} from '#/main/app/overlays'
import {LogOperationalList} from '#/main/log/components/operational-list'

const HistoryModal = (props) => {
  return (
    <Modal
      {...omit(props)}
      title={trans('history')}
    >
      <LogOperationalList
        flush={true}
        autoload={!!props.pageId}
        url={['apiv2_logs_operational_object', {objectId: props.pageId, objectName: 'Icap/LessonBundle/Entity/Chapter'}]}
      />
    </Modal>
  )
}

HistoryModal.propTypes = {
  pageId: T.string.isRequired
}

export {
  HistoryModal
}
