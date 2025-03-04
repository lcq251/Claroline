import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action'
import {Alert} from '#/main/app/components/alert'
import {FormData} from '#/main/app/content/form'
import {param} from '#/main/app/config'

import {constants} from '#/main/app/security/registration/constants'
import {selectors} from '#/main/app/security/registration/store'

class RegistrationMain extends Component {
  componentDidMount() {
    this.props.fetchRegistrationData()
  }

  render() {
    return (
      <FormData
        level={2}
        className="content-sm"
        name={selectors.FORM_NAME}
        definition={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'lastName',
                type: 'string',
                label: trans('last_name'),
                required: true
              }, {
                name: 'firstName',
                type: 'string',
                label: trans('first_name'),
                required: true
              }, {
                name: 'email',
                type: 'email',
                label: trans('email'),
                required: true,
                options: {
                  unique: {
                    check: ['apiv2_user_get', {field: 'email'}]
                  }
                }
              }, {
                name: 'username',
                type: 'string',
                label: trans('username'),
                required: true,
                displayed: param('community.username'),
                options: {
                  unique: {
                    check: ['apiv2_user_get', {field: 'username'}],
                    error: 'This username already exists.'
                  }
                }
              }, {
                name: 'plainPassword',
                type: 'password',
                label: trans('password'),
                required: true
              }, {
                name: 'meta.acceptedTerms',
                type: 'boolean',
                label: trans('accept_terms_of_service'),
                required: true
              }
            ]
          }
        ]}
      >
        <Button
          className="btn btn-primary w-100 mt-4"
          size="lg"
          type={CALLBACK_BUTTON}
          label={trans('create-account', {}, 'actions')}
          callback={() => this.props.register(this.props.user, this.props.onRegister)}
          htmlType="submit"
        />

        <Button
          className="btn btn-body w-100 mt-1"
          type={LINK_BUTTON}
          label={trans('login', {}, 'actions')}
          target="/login"
        />
      </FormData>
    )
  }
}

RegistrationMain.propTypes = {
  path: T.string,
  className: T.string,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  user: T.shape({
    // user type
  }).isRequired,
  termOfService: T.string,
  register: T.func.isRequired,
  fetchRegistrationData: T.func.isRequired,
  options: T.shape({
    validation: T.bool,
  }).isRequired,
  allFacetFields: T.array,
  onRegister: T.func
}

export {
  RegistrationMain
}
