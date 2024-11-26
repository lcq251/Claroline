import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans, transChoice} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {ResourceIcon} from '#/main/core/resource/components/icon'
import {Badge} from '#/main/app/components/badge'

const ResourceCard = props =>
  <DataCard
    {...props}
    className={classes(props.className, {
      'data-card-muted': !get(props.data, 'meta.published', false) || get(props.data, 'restrictions.hidden', false)
    })}
    id={props.data.id}
    poster={props.data.thumbnail}
    icon={!props.data.thumbnail ?
      <ResourceIcon
        mimeType={props.data.meta.mimeType}
        size={props.size}
      /> :
      null
    }
    title={props.data.name}
    meta={
      <>
        <Badge variant="secondary" subtle={true}>{trans(props.data.meta.type, {}, 'resource')}</Badge>
        {get(props.data, 'meta.published') &&
          <Badge variant="secondary" subtle={true}>{transChoice('display_views', get(props.data, 'meta.views') || 0, {count: get(props.data, 'meta.views') || 0})}</Badge>
        }
        {get(props.data, 'evaluation.estimatedDuration') &&
          <Badge variant="secondary" subtle={true}>
            <span className="fa far fa-clock me-1" />
            {get(props.data, 'evaluation.estimatedDuration') + ' ' + trans('minutes_short')}
          </Badge>
        }

        {!get(props.data, 'meta.published') &&
          <Badge variant="secondary" subtle={true}>{trans('not_published')}</Badge>
        }

        {get(props.data, 'restrictions.hidden', false) &&
          <Badge variant="secondary" subtle={true}>{trans('hidden')}</Badge>
        }
      </>
    }
    contentText={get(props.data, 'meta.description') || <em className="text-body-tertiary">{trans('no_description')}</em>}
  />

ResourceCard.propTypes = {
  className: T.string,
  size: T.string,
  data: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired
}

export {
  ResourceCard
}
