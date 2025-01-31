import React from 'react'
import get from 'lodash/get'

import {getPlainText} from '#/main/app/data/types/html/utils'
import {DataCard} from '#/main/app/data/components/card'

const MessageCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={get(props.data, 'meta.creator.picture')}
    icon={get(props.data, 'meta.creator.name') ? props.data.meta.creator.name.charAt(0) : 'fa fa-user'}
    name={props.data.subject.title}
    title={props.data.subject.title}
    contentText={getPlainText(props.data.content)}
  />

export {
  MessageCard
}
