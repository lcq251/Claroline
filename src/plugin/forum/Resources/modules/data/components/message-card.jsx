import React from 'react'
import get from 'lodash/get'

import {getPlainText} from '#/main/app/data/types/html/utils'
import {DataCard} from '#/main/app/data/components/card'
import {trans} from '#/main/app/intl'

const MessageCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    asIcon={true}
    poster={get(props.data, 'meta.creator.picture')}
    name={get(props.data, 'meta.creator.name', trans('unknown'))}
    title={get(props.data, 'subject.title')}
    contentText={getPlainText(props.data.content)}
  />

export {
  MessageCard
}
