import React, {useContext} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {PageContext} from '#/main/app/page/context'
import {PagePoster} from '#/main/app/page/components/poster'

const PageContent = ({
  className,
  poster,
  children
}) => {
  const pageDef = useContext(PageContext)

  return (
    <div className={classes('app-page-content', className)} role="presentation">
      {(poster && !pageDef.embedded) &&
        <PagePoster poster={poster} />
      }

      {children}
    </div>
  )
}

PageContent.propTypes = {
  className: T.string,
  poster: T.string,
  children: T.any
}

export {
  PageContent
}
