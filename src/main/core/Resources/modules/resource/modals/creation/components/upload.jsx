import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Form, FormContent} from '#/main/app/content/form'

import {selectors} from '#/main/core/resource/modals/creation/store/selectors'

const CreationUpload = (props) => {
  return (
    <Form
      name={selectors.STORE_NAME}
      dataPart={selectors.FORM_NODE_PART}
      flush={true}
    >
      <FormContent
        className="modal-body"
        name={selectors.STORE_NAME}
        dataPart={selectors.FORM_NODE_PART}
        flush={true}
        definition={[
          {
            title: trans('general'),
            fields: [
              {
                name: 'file',
                type: 'file',
                label: trans('file'),
                hideLabel: true,
                options: {
                  multiple: true,
                  autoUpload: false
                },
                onChange: (value) => {
                  // go to the next step
                  props.fromFile(value[0]).then((response) => {
                    props.startCreation(
                      get(response, 'meta.type'),
                      merge({meta: {published: true}}, response),
                      omit(response, 'name', 'meta')
                    )
                    props.changeStep('info')
                  })
                }
              }
            ]
          }
        ]}
      />

      <div className="modal-footer mt-n5" role="presentation">
        <Button
          type={CALLBACK_BUTTON}
          label={trans('back')}
          className="btn btn-text-body me-auto"
          callback={() => props.changeStep('start')}
        />
      </div>
    </Form>
  )
}

CreationUpload.propTypes = {
  changeStep: T.func.isRequired,
  fromFile: T.func.isRequired
}

export {
  CreationUpload
}
