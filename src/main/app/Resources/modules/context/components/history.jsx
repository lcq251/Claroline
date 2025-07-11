import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, LinkButton} from '#/main/app/buttons'

import {getRecent, parseRecent, hasRecent, emptyRecent} from '#/main/app/history'
import {Button} from '#/main/app/action'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {getPlainText} from '#/main/app/data/types/html/utils'
import {EmptyState} from '#/main/app/components/empty-state'

const ContextHistory = (props) => {
  let recent = getRecent()
  const [history, setHistory] = useState(parseRecent(recent))

  if (isEmpty(recent)) {
    return (
      <EmptyState
        icon="fa fa-history"
        title={trans('no_history_results', {}, 'history')}
        description={trans('no_history_results_help', {}, 'history')}
      />
    )
  }

  return (
    <>
      {props.delete && hasRecent() &&
        <Button
          type={CALLBACK_BUTTON}
          className="me-auto btn btn-primary"
          label={trans('empty_history', {}, 'actions')}
          callback={() => {
            emptyRecent()
            setHistory([])
          }}
          confirm={{
            message: trans('empty_history_confirm', {}, 'history'),
            additional: trans('irreversible_action_confirm')
          }}
          dangerous={true}
        />
      }

      <div className={classes('list-group list-group-striped', {
        'list-group-flush': props.flush
      })}>
        {history
          .sort((a, b) => a.date > b.date ? -1 : 1)
          .map(result => {
            return (
              <LinkButton
                key={result.id}
                className={classes('list-group-item list-group-item-action d-flex flex-row align-items-center gap-3', {
                  'px-4': props.flush
                })}
                target={result.target}
                onClick={props.onOpen}
                exact={true}
              >
                <Thumbnail
                  thumbnail={result.thumbnail}
                  name={result.name}
                  size="sm"
                  square={true}
                />
                <div className="overflow-hidden" role="presentation">
                  <div className="h6 mb-1">{result.name}</div>
                  {result.description ?
                    <p className="text-body-secondary line-clamp-1 fs-sm mb-0">{getPlainText(result.description)}</p> :
                    <em className="fs-sm text-body-tertiary">{trans('no_description')}</em>
                  }
                </div>
              </LinkButton>
            )
          })
        }
      </div>
    </>
  )
}

ContextHistory.propTypes = {
  className: T.string,
  delete: T.bool,
  flush: T.bool,
  onOpen: T.func
}

export {
  ContextHistory
}
