import React from 'react'
import {PropTypes as T} from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {SequencesModal} from '#/main/evaluation/modals/sequences/components/modal'

const CreationCopy = (props) => {
  return (
    <SequencesModal
      {...omit(props, 'changeStep', 'startCreation')}
      autoClose={false}
      selectAction={(selected) => ({
        type: CALLBACK_BUTTON,
        callback: () => {
          props.startCreation(cloneDeep(selected[0]))
          props.changeStep('form')
        }
      })}
      multiple={false}
    >
      <div className="modal-footer" role="presentation">
        <Button
          type={CALLBACK_BUTTON}
          label={trans('back')}
          className="btn btn-text-body me-auto"
          callback={() => props.changeStep('type')}
        />
      </div>
    </SequencesModal>
  )
}

CreationCopy.propTypes = {
  changeStep: T.func.isRequired,
  startCreation: T.func.isRequired
}

export {
  CreationCopy
}
