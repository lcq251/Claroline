import  React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Badge} from '#/main/app/components/badge'

const Tags = (props) =>
  <div className={classes('d-flex flex-row gap-1', props.className)} role="presentation">
    {props.tags.map(tag =>
      <Badge key={tag} variant="secondary" subtle={true} className="fs-sm lh-base">{tag}</Badge>
    )}
  </div>

Tags.propTypes = {
  className: T.string,
  tags: T.arrayOf(T.string).isRequired
}

export {
  Tags
}
