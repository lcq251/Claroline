import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {Html} from '#/main/app/components/html'
import {Tags} from '#/main/app/components/tags'

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
      <em className="text-body-tertiary">{props.placeholder}</em>
    }

    {!isEmpty(props.tags) &&
      <Tags tags={props.tags} className="mt-4" />
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
