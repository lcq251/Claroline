import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {selectors} from '#/main/app/security/login/store'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

/**
 * Form to log in with a Claroline account.
 */
class LoginAccount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inProgress: false
    }
  }

  render() {
    return (
      <FormData
        name={selectors.FORM_NAME}
        alertExit={false}
        definition={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'username',
                type: 'string',
                label: this.props.username ? trans('username_or_email') : trans('email'),
                required: true,
                autoComplete: 'username'
              }, {
                name: 'password',
                type: 'password',
                label: trans('password'),
                required: true,
                autoComplete: 'current-password',
                options: {
                  hideStrength: true,
                  disablePasswordCheck: true
                }
              }
            ]
          }
        ]}
      >
        {this.props.resetPassword &&
          <Button
            className="btn btn-link border-0 p-0 ms-auto text-wrap text-start mt-n4"
            type={LINK_BUTTON}
            label={trans('forgot_password')}
            target="/reset_password"
          />
        }

        <Button
          className="btn btn-primary w-100"
          size="lg"
          type={CALLBACK_BUTTON}
          htmlType="submit"
          label={!this.state.inProgress ? trans('login'):trans('login_in_progress')}
          disabled={this.state.inProgress}
          callback={() => {
            this.setState({inProgress: true})
            this.props.login(this.props.onLogin).then(() => this.setState({inProgress: false}))
          }}
        />
      </FormData>
    )
  }
}


LoginAccount.propTypes = {
  username: T.bool,
  resetPassword: T.bool,

  login: T.func.isRequired,
  onLogin: T.func.isRequired
}

export {
  LoginAccount
}
