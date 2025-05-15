import React, {createElement} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {DataMicro} from '#/main/app/data/components/micro'

const EntityDisplay = (props) => {
  if (!isEmpty(props.data)) {
    if (props.multiple) {
      return (
        <>
          {props.data.map(object => createElement(props.card, {
            object: object
          }))}
        </>
      )
    }

    return createElement(props.card, {
      object: props.data,
      size: 'xs'
    })
  }

  return (
    <em role="presentation" className="text-body-tertiary">{props.placeholder || trans('empty_value')}</em>
  )
}

EntityDisplay.propTypes = {
  data: T.oneOfType([
    T.object, // multiple = false
    T.arrayOf(T.object) // multiple = true
  ]),
  card: T.any,
  icon: T.string,
  placeholder: T.string,
  multiple: T.bool
}

EntityDisplay.defaultProps = {
  multiple: false,
  card: DataMicro
}

export {
  EntityDisplay
}
