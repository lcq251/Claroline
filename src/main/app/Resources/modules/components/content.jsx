import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {Badge} from '#/main/app/components/badge'
import {Html} from '#/main/app/components/html'

const Content = (props) =>
  <>
    {props.meta &&
      <div className="text-body-tertiary d-flex align-items-center gap-3 mb-4" role="presentation">
        {props.meta}
      </div>
    }

    {props.children &&
      <Html className="content-text">{props.children}</Html>
    }

    {(!props.children && props.placeholder) &&
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
  children: T.string,
  placeholder: T.string,
  tags: T.arrayOf(T.string)
}

Content.defaultProps = {
  tags: []
}

export {
  Content
}
