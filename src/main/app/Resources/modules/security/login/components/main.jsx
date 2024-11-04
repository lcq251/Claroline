import React, {Component, createElement} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'

import {getSso} from '#/main/authentication/sso'
import {LoginAccount} from '#/main/app/security/login/components/account'

class LoginMain extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sso: {}
    }
  }

  componentDidMount() {
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
    // check if we want to show the form to log in with a claroline account
    const internalAccount = this.props.forceInternalAccount || this.props.internalAccount

    return (
      <div className="">
        {internalAccount &&
          <LoginAccount
            username={this.props.username}
            resetPassword={this.props.resetPassword}
            login={this.props.login}
            onLogin={this.props.onLogin}
          />
        }

        {this.props.registration &&
          <Button
            className="btn btn-body mt-1 w-100"
            type={LINK_BUTTON}
            label={trans('create-account', {}, 'actions')}
            target="/registration"
          />
        }

        {0 !== this.props.sso.length &&
          <>
            <div className="authentication-or">
              {trans('login_auth_or')}
            </div>

            <p className="authentication-help">{trans(!internalAccount ? 'login_auth_sso' : 'login_auth_sso_other')}</p>

            <div role="presentation" className="d-grid gap-1">
              {this.props.sso.map(sso => this.state.sso[sso.service] ?
                createElement(this.state.sso[sso.service].components.button, Object.assign({}, sso, {
                  key: sso.service,
                  label: sso.label || trans('login_with_third_party_btn', {name: trans(sso.service, {}, 'oauth')})
                })) : null
              )}
            </div>
          </>
        }
      </div>
    )
  }
}

LoginMain.propTypes = {
  platformName: T.string.isRequired,
  help: T.string,
  internalAccount: T.bool.isRequired,
  forceInternalAccount: T.bool,
  sso: T.arrayOf(T.shape({
    service: T.string.isRequired,
    label: T.string,
    primary: T.bool
  })).isRequired,
  username: T.bool.isRequired,
  registration: T.bool.isRequired,
  resetPassword: T.bool.isRequired,
  login: T.func.isRequired,
  onLogin: T.func
}

LoginMain.defaultProps = {
  forceInternalAccount: false
}

export {
  LoginMain
}
