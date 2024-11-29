import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Thumbnail} from '#/main/app/components/thumbnail'

const DataStack = (props) => {
  let objects = props.objects
  if (props.limit) {
    objects = objects.slice(0, 5)
  }

  return (
    <div className={classes('thumbnail-stack d-flex flex-direction-row flex-nowrap align-items-center text-nowrap', `thumbnail-stack-${props.size}`, props.className)} role="presentation">
      {objects.map((object, index) =>
        <Thumbnail
          key={index}
          className={classes('thumbnail-icon-bordered', {
            /*'ms-n2': 0 !== index && 'xs' === props.size,
            'ms-n3': 0 !== index && 'sm' === props.size,
            'ms-n4': 0 !== index && 'md' === props.size,
            'ms-n5': 0 !== index && 'lg' === props.size*/
          })}
          {...object}
          size={props.size}
          square={true}
        />
      )}
    </div>
  )
}

DataStack.propTypes = {
  className: T.string,
  objects: T.arrayOf(
    T.shape({
      thumbnail: T.string,
      name: T.string.isRequired
    })
  ).isRequired,
  limit: T.number,
  size: T.oneOf(['xs', 'sm', 'md', 'lg']).isRequired
}

DataStack.defaultProps = {
  limit: 5
}

export {
  DataStack
}
