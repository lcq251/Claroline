import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Thumbnail} from '#/main/app/components/thumbnail'

const DataMicro = (props) =>
  <div className={classes('d-flex flex-direction-row gap-3 align-items-center', props.className)} role="presentation">
    <Thumbnail
      thumbnail={props.object.thumbnail}
      name={props.object.name}
      size="xs"
      square={true}
      color={props.color}
    />
    {props.object.name}
  </div>

DataMicro.propTypes = {
  className: T.string,
  color: T.string,
  object: T.shape({
    thumbnail: T.string,
    name: T.string.isRequired
  }).isRequired
}

export {
  DataMicro
}
