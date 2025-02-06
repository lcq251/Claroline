import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {getPlainText} from '#/main/app/data/types/html/utils'
import {DataCard} from '#/main/app/data/components/card'
import {Dot} from '#/main/app/components/dot'
import {displayUsername} from '#/main/community/utils'

import {Message as MessageTypes} from '#/plugin/message/prop-types'
import {MessageDate} from '#/plugin/message/components/date'

const MessageCard = (props) => {
  const read = get(props.data, 'meta.read', false)

  return (
    <DataCard
      {...props}
      id={props.data.id}
      className={classes(props.className, {
        'bg-body-tertiary': !read
      })}
      poster={get(props.data, 'from.picture')}
      icon={get(props.data, 'from.name') ? <>{props.data.from.name.charAt(0)}</> : null}
      asIcon={true}
      title={
        <span className={classes('d-flex flex-row align-items-center gap-2', {
          'justify-content-center': 'col' === props.orientation,
          'fw-semibold': !read,
          'fw-normal': read
        })} role="presentation">
        {!read &&
          <Dot variant="primary" />
        }
          {displayUsername(props.data.from)}

          {'row' === props.orientation &&
            <MessageDate value={get(props.data, 'meta.date')} className={classes('ms-auto badge', {
              'text-secondary-emphasis bg-secondary-subtle': read,
              'text-primary-emphasis bg-primary-subtle': !read
            })} />
          }
      </span>
      }
      contentText={
        <>
          <b className={classes('d-inline-block me-2 text-body', {
            'fw-semibold': !read,
            'fw-normal': read
          })}>{props.data.object || trans('no_object', {}, 'message')}</b>
          {getPlainText(props.data.content)}
        </>
      }
      meta={'col' === props.orientation &&
        <MessageDate value={get(props.data, 'meta.date')} className={classes('badge', {
          'text-secondary-emphasis bg-secondary-subtle': read,
          'text-primary-emphasis bg-primary-subtle': !read
        })} />
      }
    />
  )
}

MessageCard.propTypes = {
  className: T.string,
  data: T.shape(
    MessageTypes.propTypes
  ).isRequired
}

export {
  MessageCard
}
