import React from 'react'
import {useSelector} from 'react-redux'
import classes from 'classnames'

import {asset} from '#/main/app/config'
import {selectors as configSelectors} from '#/main/app/config/store'

const SecurityLayout = ({
  children,
  className
}) => {
  const brand = useSelector((state) => configSelectors.param(state, 'theme.logo'))
  const name = useSelector((state) => configSelectors.param(state, 'name'))
  const description = useSelector((state) => configSelectors.param(state, 'description'))

  return (
    <>
      <div className={classes('auth-page-col auth-page-meta flex-fill d-flex flex-column align-items-center justify-content-center px-4 py-5 w-50', className)}>
        {brand &&
          <img
            className="auth-page-brand mb-3 mx-auto"
            src={asset(brand)}
            alt={name}
          />
        }

        <h1 className="text-center">{name}</h1>

        {description &&
          <p className="content-sm text-center mt-5 lead">{description}</p>
        }
      </div>

      <div className="auth-page-col auth-page-content flex-fill d-flex flex-column align-items-center justify-content-center w-50">
        {children}
      </div>
    </>
  )
}

export {
  SecurityLayout
}
