import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useHistory} from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Form, FormContent} from '#/main/app/content/form'

import {route} from '#/main/core/resource/routing'
import {ResourceIcon} from '#/main/core/resource/components/icon'
import {selectors} from '#/main/core/resource/modals/creation/store/selectors'

const CreationInfo = (props) => {
  const history = useHistory()

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
        level={2}
        displayLevel={5}
        flush={true}
        definition={[
          {
            title: trans('general'),
            fields: [
              {
                name: 'meta.type',
                label: trans('type'),
                type: 'type',
                hideLabel: true,
                calculated: (resourceNode) => !isEmpty(get(resourceNode, 'meta.mimeType')) ? ({
                  icon: <ResourceIcon mimeType={resourceNode.meta.mimeType} />,
                  name: trans(resourceNode.meta.type, {}, 'resource'),
                  description: trans(`${resourceNode.meta.type}_desc`, {}, 'resource')
                }) : null
              }, {
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
                help: trans('Décrivez succinctement votre ressource (La description courte est affichée dans les listes).'),
                recommended: true,
                options: {
                  long: true,
                  minRows: 2
                }
              }, {
                name: 'meta.published',
                label: trans('publish_resource', {}, 'resource'),
                type: 'boolean',
                help: trans('publish_resource_help', {}, 'resource')
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
          callback={() => props.changeStep('start')}
        />

        <Button
          type={CALLBACK_BUTTON}
          label={trans('create_and_configure', {}, 'actions')}
          className="btn btn-link"
          callback={() => props.create().then((resource) => {
            history.push(route(resource.resourceNode)+'/edit')
          })}
        />
        <Button
          type={CALLBACK_BUTTON}
          label={trans('create', {}, 'actions')}
          className="btn btn-primary"
          htmlType="submit"
          callback={(e) => {
            props.create()
            e.preventDefault() // otherwise it will redirect to the form action (which is not used and send us to desktop)
          }}
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
