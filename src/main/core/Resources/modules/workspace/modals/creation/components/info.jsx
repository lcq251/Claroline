import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Form, FormContent} from '#/main/app/content/form'

import {selectors} from '#/main/core/workspace/modals/creation/store'

const CreationInfo = (props) => {
  return (
    <Form
      name={selectors.STORE_NAME}
      flush={true}
      level={2}
      displayLevel={5}
    >
      <FormContent
        className="modal-body"
        name={selectors.STORE_NAME}
        level={2}
        displayLevel={5}
        flush={true}
        definition={[
          {
            title: trans('general'),
            fields: [
              {
                name: 'poster',
                type: 'poster',
                label: trans('poster'),
                hideLabel: true
              }, {
                name: 'name',
                type: 'string',
                label: trans('name'),
                required: true,
                autoFocus: true
              }, {
                name: 'meta.description',
                type: 'string',
                label: trans('description_short'),
                help: trans('Décrivez succinctement votre espace d\'activités (La description courte est affichée dans les listes et sur la vue "À propos").'),
                options: {
                  long: true,
                  minRows: 2
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
          label={trans('create', {}, 'actions')}
          className="btn btn-primary"
          htmlType="submit"
          callback={props.create}
        />
      </div>
    </Form>
  )
}

CreationInfo.propTypes = {
  create: T.func.isRequired,
  changeStep: T.func.isRequired
}

export {
  CreationInfo
}
