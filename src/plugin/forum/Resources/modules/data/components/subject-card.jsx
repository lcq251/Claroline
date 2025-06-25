import React from 'react'
import get from 'lodash/get'

import {trans, transChoice} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'
import {Badge} from '#/main/app/components/badge'

const SubjectCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={get(props.data, 'meta.creator.picture')}
    name={get(props.data, 'meta.creator.name')}
    icon="fa fa-user"
    asIcon={true}
    title={
      <div className="d-flex flex-row gap-2 align-items-baseline" role="presentation">
        {get(props.data, 'meta.sticky') &&
          <TooltipOverlay
            id={'pinned'+props.data.id}
            position="top"
            tip={trans('stuck')}
          >
            <span className="fa fa-fw fa-thumb-tack" aria-hidden={true} />
          </TooltipOverlay>
        }

        {props.data.title}

        <Badge className="ms-auto" variant={0 === get(props.data, 'meta.messages', 0) ? 'secondary': 'primary'} subtle={true}>
          {transChoice('replies', get(props.data, 'meta.messages', 0), {count: get(props.data, 'meta.messages', 0)}, 'forum')}
        </Badge>
      </div>
    }
    contentText={get(props.data, 'content') || <em className="text-body-tertiary">{trans('no_description')}</em>}
  />

export {
  SubjectCard
}
