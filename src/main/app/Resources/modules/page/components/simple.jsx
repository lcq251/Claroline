import React from 'react'
import {PropTypes as T} from 'prop-types'
import {Helmet} from 'react-helmet'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {asset} from '#/main/app/config/asset'
import {theme} from '#/main/app/config/theme'

/**
 * Root of the current page.
 */
const PageSimple = ({
  className,
  title,
  description,
  poster,
  children,
  styles = [],
  embedded = false,
}) =>
  <div
    className={classes({
      'app-page': !embedded,
      'embedded-page': embedded
    }, className)}
    role="presentation"
  >
    {!embedded &&
      <Helmet>
        {title &&
          <title>{title}</title>
        }

        {title &&
          <meta property="og:title" content={title}/>
        }

        <meta property="og:type" content="website" />

        {poster &&
          <meta property="og:image" content={asset(poster)}/>
        }

        {description &&
          <meta name="description" property="og:description" content={description} />
        }
      </Helmet>
    }

    {!isEmpty(styles) &&
      <Helmet>
        {styles.map(style =>
          <link key={style} rel="stylesheet" type="text/css" href={theme(style)} />
        )}
      </Helmet>
    }

    {children}
  </div>

PageSimple.propTypes ={
  className: T.string,

  /**
   * Custom data used for document head.
   */
  title: T.string,
  description: T.string,
  poster: T.string,

  /**
   * A list of additional styles to add to the page.
   */
  styles: T.arrayOf(T.string),

  /**
   * Is the current page embedded into another one ?
   *
   * @type {bool}
   */
  embedded: T.bool,

  children: T.node
}

export {
  PageSimple
}
