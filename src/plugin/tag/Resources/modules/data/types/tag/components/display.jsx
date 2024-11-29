import React from 'react'
import {PropTypes as T} from 'prop-types'

import {toKey} from '#/main/app/utils/text'
import {Badge} from '#/main/app/components/badge'

const TagDisplay = (props) =>
  <>
    {props.data.map(tag =>
      <Badge key={toKey(tag)} variant="secondary" subtle={true}>{tag}</Badge>
    )}
  </>

TagDisplay.propTypes = {
  data: T.arrayOf(T.string).isRequired
}

TagDisplay.defaultProps = {
  data: []
}

export {
  TagDisplay
}
