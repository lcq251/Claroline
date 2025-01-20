import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {actions as formActions, FormData} from '#/main/app/content/form'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {selectors as contextSelectors} from '#/main/app/context/store'

import {route} from '#/main/evaluation/sequence/routing'
import {selectors} from '#/main/evaluation/sequence/modals/creation/store'

const CreationForm = (props) => {
  const history = useHistory()

  const contextData = useSelector(contextSelectors.data)

  const dispatch = useDispatch()
  const create = () => dispatch(formActions.save(selectors.STORE_NAME, ['apiv2_evaluation_sequence_create']))
  const reset = () => dispatch(formActions.reset(selectors.STORE_NAME, {
    workspace: contextData
  }, true))

  return (
    <Modal
      {...omit(props, 'changeStep')}
      title={trans('sequence', {}, 'evaluation')}
      centered={true}
      onEntering={reset}
      onExited={reset}
    >
      <FormData
        name={selectors.STORE_NAME}
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
                help: trans('Décrivez succintement votre séquence (La description courte est affichée dans les listes.'),
                recommended: true,
                options: {
                  long: true,
                  minRows: 2
                }
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
            callback={() => props.changeStep('type')}
          />

          <Button
            type={CALLBACK_BUTTON}
            label={trans('create_and_configure', {}, 'actions')}
            className="btn btn-link"
            callback={() => {
              create().then((sequence) => {
                props.fadeModal()

                history.push(route(sequence)+'/edit')
              })
            }}
          />
          <Button
            type={CALLBACK_BUTTON}
            label={trans('create', {}, 'actions')}
            className="btn btn-primary"
            htmlType="submit"
            callback={() => {
              create().then((sequence) => {
                props.fadeModal()

                //history.push(route(workspace))
              })
            }}
          />
        </div>
      </FormData>
    </Modal>
  )
}

CreationForm.propTypes = {
  changeStep: T.func.isRequired
}

export {
  CreationForm
}
