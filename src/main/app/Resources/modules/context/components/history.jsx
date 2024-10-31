import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {DataCard} from '#/main/app/data/components/card'

import {getRecent, removeRecent, parseRecent, hasRecent, emptyRecent} from '#/main/app/history'
import {Datetime} from '#/main/app/components/date'
import {Button} from '#/main/app/action'

const ContextHistory = (props) => {
  let recent = getRecent()
  const [history, setHistory] = useState(parseRecent(recent))

  if (isEmpty(recent)) {
    return (
      <div className={classes('text-center', props.className)} role="presentation">
        <p className="lead mb-1">{trans('no_history_results', {}, 'history')}</p>
        <p className="mb-0 text-secondary">{trans('no_history_results_help', {}, "history")}</p>
      </div>
    )
  }

  return (
    <div className={props.className} role="presentation">
      {props.empty && hasRecent() &&
        <Button
          type={CALLBACK_BUTTON}
          className="mb-3 me-auto btn btn-primary"
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

      <h5 className="fs-sm text-uppercase text-body-secondary">{trans('recent', {}, 'history')}</h5>
      <div className="d-flex flex-column gap-2" role="presentation">
        {history
          .sort((a, b) => a.date > b.date ? -1 : 1)
          .map(result => (
            <DataCard
              key={result.id}
              id={result.id}
              size={props.size}
              direction="row"
              title={result.name}
              contentText={result.description}
              poster={result.thumbnail}
              icon={!result.thumbnail ? <>{result.name.charAt(0)}</> : null}
              primaryAction={{
                type: LINK_BUTTON,
                label: trans('open', {}, 'actions'),

                target: result.target,
                onClick: props.onOpen
              }}
              meta={
                <div className="text-body-tertiary ms-auto" role="presentation">
                  Dernière consultation le <Datetime value={result.date} time={true} />
                </div>
              }
              actions={[
                {
                  name: 'delete',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-times',
                  label: trans('delete', {}, 'actions'),
                  callback: () => {
                    const newRecent = removeRecent(result.id)
                    setHistory(parseRecent(newRecent))
                  }
                }
              ]}
            />
          ))
        }
      </div>
    </div>
  )
}

ContextHistory.propTypes = {
  className: T.string,
  size: T.string,
  empty: T.bool,
  onOpen: T.func
}

ContextHistory.defaultProps = {
  size: 'xs',
  empty: false
}

export {
  ContextHistory
}
