import React from 'react'
import {PropTypes as T} from 'prop-types'
import {UserMicro} from '#/main/core/user/components/micro'
import get from 'lodash/get'
import {Datetime} from '#/main/app/components/date'

const Meta = (props) =>
  <div className="text-body-tertiary fw-bolder d-flex align-items-center gap-3 mb-4" role="presentation">
    <UserMicro
      {...get(props.announcement, 'meta.creator', {})}
      noStatus={true}
      link={true}
    />

    <span>-</span>

    {get(props.announcement, 'meta.publishedAt') &&
      <Datetime value={get(props.announcement, 'meta.publishedAt')} long={true} />
    }
  </div>

export {

}