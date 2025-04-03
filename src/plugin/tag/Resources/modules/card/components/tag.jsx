import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import classes from 'classnames'

import {trans, transChoice} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'
import {Badge} from '#/main/app/components/badge'

import {Tag as TagTypes} from '#/plugin/tag/data/types/tag/prop-types'

const TagCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    title={
      <div className={classes('d-flex flex-row gap-2 align-items-baseline', {
        'justify-content-center': 'row' !== props.orientation
      })}>
        {props.data.name}

        {'row' === props.orientation &&
          <Badge className="ms-auto" variant="secondary" subtle={true}>{transChoice('count_elements', props.data.elements, {count: props.data.elements})}</Badge>
        }
      </div>
    }
    color={props.data.color}
    icon="fa fa-tag"
    name={props.data.name}
    contentText={get(props.data, 'meta.description')  || <em className="text-body-tertiary">{trans('no_description')}</em>}
    asIcon={true}
    meta={
      <Badge variant="secondary" subtle={true}>{transChoice('count_elements', get(props.data, 'elements', 0), {count: get(props.data, 'elements', 0)})}</Badge>
    }
  />

TagCard.propTypes = {
  data: T.shape(
    TagTypes.propTypes
  ).isRequired
}

export {
  TagCard
}
