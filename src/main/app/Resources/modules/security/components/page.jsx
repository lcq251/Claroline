import React from 'react'
import {PropTypes as T} from 'prop-types'

import {PageSimple} from '#/main/app/page/components/simple'
import {useSelector} from 'react-redux'
import {selectors as configSelectors} from '#/main/app/config/store'
import classes from 'classnames'
import {asset} from '#/main/app/config'
import {CountryFlag} from '#/main/app/components/country-flag'
import {trans} from '#/main/app/intl'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_LOCALE} from '#/main/app/modals/locale'
import {Button} from '#/main/app/action'
import {MODAL_TERMS_OF_SERVICE} from '#/main/privacy/modals/terms-of-service'
import {MODAL_PRIVACY} from '#/main/privacy/modals/privacy'

const SecurityPage = (props) => {
  const brand = useSelector((state) => configSelectors.param(state, 'theme.logo'))
  const name = useSelector((state) => configSelectors.param(state, 'name'))
  const description = useSelector((state) => configSelectors.param(state, 'description'))
  const locale = useSelector((state) => configSelectors.param(state, 'locale.current'))

  return (
    <PageSimple
      className="auth-page"
      title={props.title + ' | ' + name}
    >
      <div className="col auth-page-meta px-4 py-5">
        {brand &&
          <img
            className={classes('auth-page-brand mb-3 mx-auto', props.className)}
            src={asset(brand)}
            alt={name}
          />
        }

        <h1 className="text-center">{name}</h1>

        {description &&
          <p className="content-sm text-center mt-5 lead">{description}</p>
        }
      </div>

      <div className="col auth-page-content">
        <div className="content-sm px-4 py-5 mt-auto" role="presentation">
          <h2 className="text-center">{props.title}</h2>
          {props.description &&
            <p className="lead text-center text-body-secondary mb-5">{props.description}</p>
          }

          {props.children}
        </div>

        <footer className="content-sm px-4 pb-5 mt-auto d-flex align-items-center justify-content-center gap-2">
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
      </div>
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
