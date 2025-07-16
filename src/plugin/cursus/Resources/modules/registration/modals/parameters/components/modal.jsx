import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {formatSections} from '#/main/app/content/form/parameters/utils'
import {Form, FormContent} from '#/main/app/content/form'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {getInfo, isFull} from '#/plugin/cursus/utils'

import {selectors} from '#/plugin/cursus/registration/modals/parameters/store/selectors'

const ParametersModal = props => {
  const isManager = hasPermission('edit', props.course)
  let allFields = []
  get(props.course, 'registration.form', []).map(section => {
    allFields = allFields.concat(section.fields)
  })

  const sections = formatSections(get(props.course, 'registration.form', []), allFields, 'data', true, isManager, isManager)
  sections[0].defaultOpened = true

  return (
    <Modal
      {...omit(props, 'course', 'session', 'registration', 'formData', 'isNew', 'save', 'reset', 'onSave')}
      title={trans('registration')}
      subtitle={getInfo(props.course, props.session, 'name')}
      onEntering={() => props.reset(props.registration)}
    >
      <Form
        className="overflow-hidden"
        name={selectors.STORE_NAME}
        level={2}
        displayLevel={5}
        flush={true}
      >
        <FormContent
          className="modal-body"
          name={selectors.STORE_NAME}
          level={2}
          displayLevel={5}
          definition={sections}
          flush={true}
        />
        <div className="modal-footer flex-sm-nowrap gap-2 mt-n5">
          <Button
            className="btn btn-primary"
            type={CALLBACK_BUTTON}
            htmlType="submit"
            label={props.isNew ?
              trans(!props.session || isFull(props.session) ? 'register_waiting_list' : 'self_register', {}, 'actions') :
              trans('save', {}, 'actions')
            }
            callback={() => {
              props.save(allFields, props.formData, true, isManager, (data) => {
                props.onSave(data)
                props.fadeModal()
              })
            }}
          />
        </div>
      </Form>
    </Modal>
  )
}

ParametersModal.propTypes = {
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  session: T.shape(
    SessionTypes.propTypes
  ),
  registration: T.object,
  isNew: T.bool.isRequired,
  formData: T.object,
  save: T.func.isRequired,
  onSave: T.func,
  reset: T.func.isRequired,

  // from modal
  fadeModal: T.func.isRequired
}

export {
  ParametersModal
}
