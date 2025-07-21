import React from 'react'
import {useSelector} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {ASYNC_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'
import {Form, FormContent, selectors as formSelectors} from '#/main/app/content/form'

import {selectors} from '#/main/core/workspace/modals/creation/store'

const CreationUpload = (props) => {
  const data = useSelector((state) => formSelectors.data(formSelectors.form(state, selectors.STORE_NAME)))

  const formData = new FormData()
  formData.append('archive', data.archive) // this is an uploaded file

  return (
    <Form
      name={selectors.STORE_NAME}
      flush={true}
    >
      <FormContent
        className="modal-body"
        name={selectors.STORE_NAME}
        flush={true}
        definition={[
          {
            title: trans('general'),
            fields: [
              {
                name: 'archive',
                type: 'file',
                label: trans('archive'),
                required: true,
                options: {
                  multiple: false,
                  autoUpload: false
                }
              }
            ]
          }
        ]}
      />

      <div className="modal-footer mt-n5">
        <Button
          type={CALLBACK_BUTTON}
          label={trans('back')}
          className="btn btn-text-body me-auto"
          callback={() => props.changeStep('type')}
        />

        <Button
          type={CALLBACK_BUTTON}
          label={trans('Importer & Configurer', {}, 'actions')}
          className="btn btn-link"
          callback={() => true}
          disabled={!data.archive}
        />
        <Button
          type={ASYNC_BUTTON}
          label={trans('import', {}, 'actions')}
          className="btn btn-primary"
          callback={() => true}
          disabled={!data.archive}
          request={{
            url: ['apiv2_workspace_import'],
            request: {
              method: 'POST',
              body: formData,
              headers: new Headers({
                //no Content type for automatic detection of boundaries.
                'X-Requested-With': 'XMLHttpRequest'
              })
            },
            success: (response) => {
              props.fadeModal()

              if (props.onCreate) {
                props.onCreate(response)
              }
            }
          }}
        />
      </div>
    </Form>
  )
}

CreationUpload.propTypes = {
  changeStep: T.func.isRequired,
  onCreate: T.func,
  fadeModal: T.func.isRequired
}

export {
  CreationUpload
}
