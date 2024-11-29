import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'

const CourseCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    title={
      <>
        {(get(props.data, 'registration.selfRegistration') || get(props.data, 'registration.autoRegistration')) &&
          <TooltipOverlay
            id={'training-type'+props.data.id}
            position="top"
            tip={trans('public_registration')}
          >
            <span className="fa fa-fw fa-globe me-2" aria-hidden={true} />
          </TooltipOverlay>
        }

        {props.data.name}
      </>
    }
    contentText={props.data.plainDescription || <em className="text-body-tertiary">{trans('no_description')}</em>}
  />

CourseCard.propTypes = {
  data: T.shape(
    CourseTypes.propTypes
  ).isRequired
}

export {
  CourseCard
}
