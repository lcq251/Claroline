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
const PageSimple = props =>
  <div
    className={classes('app-page', {
      'app-page-embedded': props.embedded
    }, props.className)}
    role="presentation"
  >
    {!props.embedded &&
      <Helmet>
        {props.title &&
          <title>{props.title}</title>
        }

        {props.title &&
          <meta property="og:title" content={props.title}/>
        }

        <meta property="og:type" content="website" />

        {props.poster &&
          <meta property="og:image" content={asset(props.poster)}/>
        }

        {props.description &&
          <meta name="description" property="og:description" content={props.description} />
        }
      </Helmet>
    }

    {!isEmpty(props.styles) &&
      <Helmet>
        {props.styles.map(style =>
          <link key={style} rel="stylesheet" type="text/css" href={theme(style)} />
        )}
      </Helmet>
    }

    {props.children}
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

PageSimple.defaultProps = {
  embedded: false,
  styles: []
}

export {
  PageSimple
}
