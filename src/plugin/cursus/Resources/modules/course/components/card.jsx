import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {Badge} from '#/main/app/components/badge'

const CourseCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={props.data.name}
    contentText={props.data.plainDescription || <em className="text-body-tertiary">{trans('no_description')}</em>}
    meta={
      <>
        {(get(props.data, 'registration.selfRegistration') || get(props.data, 'registration.autoRegistration')) &&
          <Badge variant="secondary" subtle={true}>{trans('public_registration')}</Badge>
        }
      </>
    }
  />

CourseCard.propTypes = {
  data: T.shape(
    CourseTypes.propTypes
  ).isRequired
}

export {
  CourseCard
}
