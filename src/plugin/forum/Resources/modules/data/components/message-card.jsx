import React from 'react'
import get from 'lodash/get'

import {getPlainText} from '#/main/app/data/types/html/utils'
import {DataCard} from '#/main/app/data/components/card'

const MessageCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={get(props.data, 'meta.creator.picture')}
    icon={!get(props.data, 'meta.creator.picture') && get(props.data, 'meta.creator') ? <>{props.data.meta.creator.name.charAt(0)}</> : <span className="fa fa-user" aria-hidden={true}/>}
    title={props.data.subject.title}
    contentText={getPlainText(props.data.content)}
  />

export {
  MessageCard
}
