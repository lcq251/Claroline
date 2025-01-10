import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form'

import {selectors} from '#/main/core/resource/modals/creation/store/selectors'

const CreationUrl = (props) => {
  return (
    <FormData
      name={selectors.STORE_NAME}
      dataPart={selectors.FORM_NODE_PART}
      flush={true}
      definition={[
        {
          title: trans('general'),
          fields: [
            {
              name: 'url',
              type: 'url',
              label: trans('url'),
              hideLabel: true,
              //options: {multiple: true}
            }
          ]
        }
      ]}
    >
      <div className="modal-footer">
        <Button
          type={CALLBACK_BUTTON}
          label={trans('back')}
          className="btn btn-text-body me-auto"
          callback={() => props.changeStep('start')}
        />
      </div>
    </FormData>
  )
}

CreationUrl.propTypes = {
  /*create: T.func.isRequired,
  fadeModal: T.func.isRequired,*/
  changeStep: T.func.isRequired
}

export {
  CreationUrl
}
