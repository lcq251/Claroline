import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {DataCard} from '#/main/app/data/components/card'

import {Template as TemplateTypes} from '#/main/template/data/types/template/prop-types'
import {Badge} from '#/main/app/components/badge'

const TemplateCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    title={props.data.name}
    contentText={props.data.description || <em>{trans('no_description')}</em>}
    icon={props.data.name && <>{props.data.name.charAt(0)}</>}
    meta={
      <>
        {props.data.system &&
          <Badge subtle={true} variant="secondary">
            {trans('system')}
          </Badge>
        }
        {props.data.default &&
          <Badge subtle={true} variant="primary">
            {trans('default')}
          </Badge>
        }
      </>
    }
  />

TemplateCard.propTypes = {
  data: T.shape(
    TemplateTypes.propTypes
  ).isRequired
}

export {
  TemplateCard
}
