import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans, transChoice} from '#/main/app/intl'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'
import {DataCard} from '#/main/app/data/components/card'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

const WorkspaceCard = props =>
  <DataCard
    {...props}
    poster={props.data.thumbnail}
    icon="fa fa-book"
    name={props.data.name}
    title={
      <>
        {get(props.data, 'meta.public') &&
          <TooltipOverlay
            id={'ws-type'+props.data.id}
            position="top"
            tip={trans('public_registration')}
          >
            <span className="fa fa-fw fa-globe me-2" aria-hidden={true} />
          </TooltipOverlay>
        }

        {props.data.name}
      </>
    }
    contentText={get(props.data, 'meta.description') || <em className="text-body-tertiary">{trans('no_description')}</em>}
    meta={
      <>
        <span className="badge bg-secondary-subtle text-secondary-emphasis">{transChoice('display_views', get(props.data, 'meta.views') || 0, {count: get(props.data, 'meta.views') || 0})}</span>
        {get(props.data, 'evaluation.estimatedDuration') &&
          <span className="badge bg-secondary-subtle text-secondary-emphasis">
            <span className="fa far fa-clock me-1" />
            {get(props.data, 'evaluation.estimatedDuration') + ' ' + trans('minutes_short')}
          </span>
        }
        {get(props.data, 'meta.archived') &&
          <span className="badge bg-secondary-subtle text-secondary-emphasis text-capitalize">{trans('archived')}</span>
        }

        {get(props.data, 'restrictions.hidden', false) &&
          <span className="badge bg-secondary-subtle text-secondary-emphasis text-capitalize">{trans('hidden')}</span>
        }
      </>
    }
  />

WorkspaceCard.propTypes = {
  className: T.string,
  data: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired
}

export {
  WorkspaceCard
}
