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
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {route} from '#/main/evaluation/sequence/routing'
import {selectors} from '#/main/evaluation/sequence/modals/creation/store'

const CreationForm = (props) => {
  const history = useHistory()

  const toolPath = useSelector(toolSelectors.path)

  const dispatch = useDispatch()
  const reset = () => dispatch(formActions.reset(selectors.STORE_NAME, {}, true))

  return (
    <Modal
      {...omit(props, 'create', 'changeStep')}
      title={trans('sequence', {}, 'evaluation')}
      centered={true}
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
                help: trans('Décrivez succinctement votre séquence (La description courte est affichée dans les listes.'),
                recommended: true,
                options: {
                  long: true,
                  minRows: 2
                }
              }, {
                name: 'meta.published',
                label: trans('publish_sequence', {}, 'evaluation'),
                type: 'boolean',
                help: trans('publish_sequence_help', {}, 'evaluation')
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
            callback={() => props.create().then((sequence) => {
              history.push(route(sequence, toolPath)+'/edit')
            })}
          />
          <Button
            type={CALLBACK_BUTTON}
            label={trans('create', {}, 'actions')}
            className="btn btn-primary"
            htmlType="submit"
            callback={props.create}
          />
        </div>
      </FormData>
    </Modal>
  )
}

CreationForm.propTypes = {
  create: T.func.isRequired,
  changeStep: T.func.isRequired
}

export {
  CreationForm
}
