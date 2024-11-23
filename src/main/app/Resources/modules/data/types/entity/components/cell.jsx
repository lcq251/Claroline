import React, {createElement} from 'react'
import isEmpty from 'lodash/isEmpty'

import {implementPropTypes, PropTypes as T} from '#/main/app/prop-types'
import {UrlButton} from '#/main/app/buttons/url'
import {DataMicro} from '#/main/app/data/components/micro'

import {DataCell as DataCellTypes} from '#/main/app/data/types/prop-types'

const EntityItem = (props) => {
  if (props.link) {
    return (
      <UrlButton target={'#'+props.link(props.item)}>
        {createElement(props.card, {
          object: props.item,
        })}
      </UrlButton>
    )
  }

  return createElement(props.card, {
    object: props.item,
  })
}

EntityItem.propTypes = {
  link: T.func,
  card: T.any.isRequired,
  item: T.object.isRequired
}

const EntityCell = props => {
  if (isEmpty(props.data)) {
    return '-'
  }

  if (props.multiple) {

  }

  return (
    <EntityItem
      link={props.link}
      item={props.data}
      card={props.card}
    />
  )
}

implementPropTypes(EntityCell, DataCellTypes, {
  link: T.func,
  multiple: T.bool,
  card: T.any
}, {
  multiple: false,
  card: DataMicro
})

export {
  EntityCell
}
