import React, {Component, createElement} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action'
import {FormData} from '#/main/app/content/form'
import {param} from '#/main/app/config'
import {Divider} from '#/main/app/components/divider'

import {getSso} from '#/main/authentication/sso'

import {selectors} from '#/main/app/security/registration/store'

class RegistrationMain extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sso: {}
    }
  }

  componentDidMount() {
    this.props.fetchRegistrationData()

    if (0 !== this.props.sso.length) {
      Promise.all(
        this.props.sso.map(sso => getSso(sso.service))
      ).then(
        // we convert the list into an object keyed with service name for easier access in render
        all => this.setState({sso: all.reduce((acc, current) => Object.assign(acc, {[current.default.name]: current.default}), {})})
      )
    }
  }

  render() {
    const displayedSso = (this.props.sso || []).filter(sso => undefined === sso.displayed || sso.displayed)

    return (
      <>
        {0 !== displayedSso.length &&
          <div role="presentation" className="d-grid gap-1 mb-4">
            {displayedSso.map(sso => this.state.sso[sso.service] ?
              createElement(this.state.sso[sso.service].components.button, Object.assign({}, sso, {
                key: sso.label || sso.service,
                label: sso.label || trans('login_with_third_party_btn', {name: trans(sso.service, {}, 'oauth')}),
                primary: 1 === displayedSso.length
              })) : null
            )}
          </div>
        }

        {0 !== displayedSso.length &&
          <Divider
            className="mb-4"
            label={trans('login_auth_or')}
            align="center"
          />
        }

        <FormData
          level={2}
          className="content-md"
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
            className="btn btn-primary w-100"
            size="lg"
            type={CALLBACK_BUTTON}
            label={trans('create-account', {}, 'actions')}
            callback={() => this.props.register(this.props.user, this.props.onRegister)}
            htmlType="submit"
          />
        </FormData>

        <Button
          className="btn btn-body w-100 mt-1"
          type={LINK_BUTTON}
          label={trans('login', {}, 'actions')}
          target="/login"
        />
      </>
    )
  }
}

RegistrationMain.propTypes = {
  className: T.string,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  user: T.shape({
    // user type
  }).isRequired,
  termOfService: T.string,
  sso: T.arrayOf(T.shape({
    service: T.string.isRequired,
    label: T.string,
    primary: T.bool
  })).isRequired,
  register: T.func.isRequired,
  fetchRegistrationData: T.func.isRequired,
  options: T.shape({
    validation: T.bool
  }).isRequired,
  allFacetFields: T.array,
  onRegister: T.func
}

export {
  RegistrationMain
}
