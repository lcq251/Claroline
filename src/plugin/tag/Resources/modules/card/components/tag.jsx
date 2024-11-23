import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans, transChoice} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'
import {Badge} from '#/main/app/components/badge'

import {Tag as TagTypes} from '#/plugin/tag/data/types/tag/prop-types'

const TagCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    title={props.data.name}
    color={props.data.color}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    contentText={props.data.meta.description  || <em className="text-body-tertiary">{trans('no_description')}</em>}
    asIcon={true}
    meta={
      <Badge variant="secondary" subtle={true}>{transChoice('count_elements', props.data.elements, {count: props.data.elements})}</Badge>
    }
  />

TagCard.propTypes = {
  className: T.string,
  data: T.shape(
    TagTypes.propTypes
  ).isRequired
}

export {
  TagCard
}
