import React from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {getPlainText} from '#/main/app/data/types/html/utils'
import {DataCard} from '#/main/app/data/components/card'
import {UserMicro} from '#/main/core/user/components/micro'
import {Datetime} from '#/main/app/components/date'

const AnnouncementCard = (props) =>
  <DataCard
    {...props}
    name={props.data.title}
    title={props.data.title}
    poster={props.data.poster}
    status={props.loaded && !get(props.data, 'meta.publishedAt') ? {
      variant: 'secondary',
      text: trans('not_published')
    } : undefined}
    contentText={getPlainText(props.data.content)}
    meta={
      <>
        <UserMicro {...get(props.data, 'meta.creator', {})} className="fs-sm text-body-secondary" />

        {get(props.data, 'meta.publishedAt') &&
          <>
            <span className="fs-sm text-body-secondary" aria-hidden={true}>-</span>
            <Datetime className="fs-sm text-body-secondary" value={get(props.data, 'meta.publishedAt')} time={true} />
          </>
        }
      </>
    }
  >

  </DataCard>

export {
  AnnouncementCard
}
