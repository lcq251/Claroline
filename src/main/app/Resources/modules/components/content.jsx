import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {Badge} from '#/main/app/components/badge'
import {ContentHtml} from '#/main/app/content/components/html'

const Content = (props) =>
  <>
    {props.meta &&
      <div className="text-body-tertiary d-flex align-items-center gap-3 mb-4" role="presentation">
        {props.meta}
      </div>
    }

    {props.text &&
      <ContentHtml className={props.lead && 'lead'}>{props.text}</ContentHtml>
    }

    {(!props.text && props.placeholder) &&
      <em className="lead">{props.placeholder}</em>
    }

    {!isEmpty(props.tags) &&
      <div className="mt-4 d-flex flex-row gap-1" role="presentation">
        {props.tags.map(tag =>
          <Badge key={tag} variant="secondary" subtle={true} className="fs-sm lh-base">{tag}</Badge>
        )}
      </div>
    }
  </>

Content.propTypes = {
  meta: T.node,
  text: T.string,
  lead: T.bool,
  placeholder: T.string,
  tags: T.arrayOf(T.string)
}

Content.defaultProps = {
  lead: true,
  tags: []
}

export {
  Content
}
