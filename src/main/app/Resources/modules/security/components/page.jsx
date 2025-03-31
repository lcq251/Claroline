import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {PageSimple} from '#/main/app/page/components/simple'

import {selectors as configSelectors} from '#/main/app/config/store'
import {CountryFlag} from '#/main/app/components/country-flag'
import {MODAL_LOCALE} from '#/main/app/modals/locale'
import {MODAL_TERMS_OF_SERVICE} from '#/main/privacy/modals/terms-of-service'
import {MODAL_PRIVACY} from '#/main/privacy/modals/privacy'
import {SecurityLayout} from '#/main/app/security/components/layout'

const SecurityPage = (props) => {
  const name = useSelector((state) => configSelectors.param(state, 'name'))
  const locale = useSelector((state) => configSelectors.param(state, 'locale.current'))

  return (
    <PageSimple
      className="auth-page d-flex flex-column flex-lg-row"
      title={props.title + ' | ' + name}
    >
      <SecurityLayout>
        <div className="content-sm px-4 py-5 my-auto" role="presentation">
          <h2 className="text-center">{props.title}</h2>
          {props.description &&
            <p className="lead text-center text-body-secondary mb-5">{props.description}</p>
          }

          {props.children}
        </div>

        <footer className="content-sm px-4 pb-5 d-flex flex-wrap align-items-center justify-content-center gap-2">
          <Button
            className="btn btn-link text-body-secondary"
            type={MODAL_BUTTON}
            modal={[MODAL_LOCALE, {current: locale}]}
            icon={<CountryFlag className="me-2" countryCode={'en' === locale ? 'gb' : locale} />}
            label={trans(locale)}
          />

          <span>-</span>

          <Button
            className="btn btn-link text-body-secondary"
            type={MODAL_BUTTON}
            modal={[MODAL_TERMS_OF_SERVICE]}
            label={trans('terms_of_service', {}, 'privacy')}
          />

          <span>-</span>

          <Button
            className="btn btn-link text-body-secondary"
            type={MODAL_BUTTON}
            modal={[MODAL_PRIVACY]}
            label={trans('privacy_policy', {}, 'privacy')}
          />
        </footer>
      </SecurityLayout>
    </PageSimple>
  )
}

SecurityPage.propTypes = {
  title: T.string.isRequired,
  description: T.string,
  children: T.node.isRequired
}

export {
  SecurityPage
}
