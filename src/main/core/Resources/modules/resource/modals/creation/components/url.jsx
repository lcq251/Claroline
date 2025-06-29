import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Form, FormContent} from '#/main/app/content/form'

import {selectors} from '#/main/core/resource/modals/creation/store/selectors'


const CreationUrl = (props) => {
  const newNode = useSelector(selectors.newNode)

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
                name: 'url',
                type: 'url',
                label: trans('url'),
                hideLabel: true,
                //options: {multiple: true}
              }
            ]
          }
        ]}
      />

      <div className="modal-footer mt-n5">
        <Button
          className="btn btn-text-body me-auto"
          type={CALLBACK_BUTTON}
          label={trans('back')}
          callback={() => props.changeStep('start')}
        />
        <Button
          className="btn btn-primary"
          type={CALLBACK_BUTTON}
          label={trans('continue', {}, 'actions')}
          disabled={isEmpty(newNode.url)}
          callback={() => {
            props.fromUrl(newNode.url).then((response) => {
              props.startCreation(
                get(response, 'meta.type'),
                merge({meta: {published: true}}, response),
                omit(response, 'name', 'meta')
              )
              props.changeStep('info')
            })
          }}
        />
      </div>
    </Form>
  )
}

CreationUrl.propTypes = {
  fromUrl: T.func.isRequired,
  changeStep: T.func.isRequired,
  startCreation: T.func.isRequired
}

export {
  CreationUrl
}
