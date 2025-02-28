import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Html} from '#/main/app/components/html'
import {MediasDisplay} from '#/plugin/exo/data/types/medias/components/display'

const Metadata = props =>
  <>
    {((props.showTitle && props.item.title) || props.numbering) &&
      <h4 className="h5 item-title">
        {props.numbering &&
          <span className="h-numbering">{props.numbering}</span>
        }

        {props.showTitle && props.item.title}
      </h4>
    }

    {props.item.content && !props.isContentItem &&
      <Html className="content-text item-content lead mb-3">{props.item.content}</Html>
    }

    {props.item.description &&
      <Html className="content-text item-description mb-3">{props.item.description}</Html>
    }

    {props.item.objects && 0 !== props.item.objects.length &&
      <MediasDisplay data={props.item.objects} />
    }
  </>

Metadata.propTypes = {
  item: T.shape({
    title: T.string,
    content: T.string,
    description: T.string,
    objects: T.arrayOf(T.shape({
      id: T.string.isRequired,
      type: T.string.isRequired,
      url: T.string,
      data: T.string
    }))
  }).isRequired,
  isContentItem: T.bool,
  numbering: T.string,
  showTitle: T.bool
}

Metadata.defaultProps = {
  showTitle: true
}

export {
  Metadata
}
