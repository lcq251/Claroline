import React, {useCallback, useId, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import omit from 'lodash/omit'

import {useReducer} from '#/main/app/store/reducer'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, CallbackButton} from '#/main/app/buttons'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {
  FormData,
  makeFormReducer,
  actions as formActions,
  selectors as formSelectors
} from '#/main/app/content/form'

const FormModal = (props) => {
  // append form reducer to the store if not already mounted
  const reducer = useMemo(() => makeFormReducer(props.name), [props.name])
  useReducer(props.name, reducer)

  const [saving, setSaving] = useState(false)

  const form = useSelector((state) => formSelectors.form(state, props.name))
  const formData = useSelector(() => formSelectors.data(form))
  const hasPendingChanges = useSelector(() => formSelectors.pendingChanges(form))
  const hasErrors = useSelector(() => formSelectors.hasErrors(form))
  const saveEnabled = useSelector(() => formSelectors.saveEnabled(form))

  const dispatch = useDispatch()
  const reset = useCallback((initialData, isNew) => {
    dispatch(formActions.reset(props.name, initialData, isNew))
  }, [props.name])


  const save = useCallback((target) => {
    setSaving(true)
    return dispatch(formActions.save(props.name, target)).then(
      () => setSaving(false),
      (response) => {
        setSaving(false)
        return Promise.reject(response)
      }
    )
  }, [props.name])

  const descriptionId = useId()

  return (
    <Modal
      size="md"
      {...omit(props, 'name', 'isNew', 'data', 'definition', 'target', 'onSave', 'onCancel', 'saveLabel')}
      onEnter={() => reset(props.data, props.isNew)}
      scrollable={true}
      centered={true}
      closeButton={false}
      backdrop={hasPendingChanges ? 'static' : true}
    >
      <FormData
        flush={true}
        name={props.name}
        definition={props.definition}
      >
        <div
          className="modal-footer flex-sm-nowrap gap-2"
          role="toolbar"
          aria-label={trans('form_toolbar')}
          aria-describedby={descriptionId}
        >
          {(hasPendingChanges && !hasErrors) &&
            <p className="fw-medium fs-sm me-auto" id={descriptionId}>{trans('form_pending_changes')}</p>
          }
          {hasErrors &&
            <p className="fw-medium text-danger fs-sm me-auto" id={descriptionId}>{trans('form_errors')}</p>
          }

          <div className="flex-nowrap d-flex gap-2">
            <Button
              className="btn btn-body"
              type={CALLBACK_BUTTON}
              htmlType="submit"
              label={trans('cancel', {}, 'actions')}
              disabled={saving}
              callback={() => {
                reset(props.data, props.isNew)
                if (props.onCancel) {
                  props.onCancel()
                }

                props.fadeModal()
              }}
            />
            <CallbackButton
              className={classes('position-relative btn btn-primary', {
                'opacity-100': saving
              })}
              htmlType="submit"
              disabled={!saveEnabled || saving}
              callback={() => {
                if (props.target) {
                  return save(props.target).then((response) => {
                    if (props.onSave) {
                      props.onSave(response)
                    }
                    props.fadeModal()
                  })
                }

                if (props.onSave) {
                  props.onSave(formData)
                }
                props.fadeModal()
              }}
            >
              {saving ?
                <>
                  <div className="position-absolute top-50 start-50 translate-middle" role="presentation">
                    <div className="dot-elastic" aria-hidden={true} />
                    <span className="visually-hidden">{trans('form_save')}</span>
                  </div>
                  <span style={{visibility: 'hidden'}} aria-hidden={true}>
                    {props.saveLabel || trans(props.isNew ? 'create' : 'save', {}, 'actions')}
                  </span>
                </> :
                props.saveLabel || trans(props.isNew ? 'create' : 'save', {}, 'actions')
              }
            </CallbackButton>
          </div>
        </div>
      </FormData>
    </Modal>
  )
}

FormModal.propTypes = {
  /**
   * The path where the store of the form is mounted.
   */
  name: T.string.isRequired,

  /**
   * The modal size.
   */
  size: T.oneOf(['sm', 'md', 'lg', 'xl']),

  /**
   * The edited data.
   */
  data: T.object,

  isNew: T.bool,

  /**
   * The API endpoint to call when the user wants to save the form.
   */
  target: T.oneOfType([
    // a URL string
    T.string,
    // a route definition
    T.array,
    // a function which returns a URL or a route
    // it receives the current form data and the isNew flag as argument.
    // ex. (formData, isNew) => isNew ? ['api_object_create'] : ['api_object_update', {id: formData.id}]
    // T.func // maybe no longer needed
  ]),
  definition: T.array,
  onSave: T.func,
  onCancel: T.func,
  saveLabel: T.string,

  // from modal
  fadeModal: T.func.isRequired
}

export {
  FormModal
}
