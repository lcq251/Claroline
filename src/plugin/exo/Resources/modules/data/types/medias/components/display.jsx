import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ContentThumbnail} from '#/plugin/exo/contents/components/content-thumbnail'

const MediasDisplay = (props) =>
  <div className="d-flex flex-row flex-wrap gap-2">
    {props.data.map((object, index) =>
      <ContentThumbnail
        id={object.id}
        index={index}
        key={`item-object-${object.id}-thumbnail`}
        data={object.data || object.url}
        type={object.type}
      />
    )}
  </div>

MediasDisplay.propTypes = {
  data: T.arrayOf(T.shape({
    id: T.string.isRequired,
    type: T.string.isRequired,
    url: T.string,
    data: T.string
  })).isRequired
}

export {
  MediasDisplay
}
