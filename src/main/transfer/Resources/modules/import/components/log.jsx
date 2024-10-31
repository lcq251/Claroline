import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, MENU_BUTTON, URL_BUTTON} from '#/main/app/buttons'
import {Dot} from '#/main/app/components/dot'
import {Datetime} from '#/main/app/components/date'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

import {Logs} from '#/main/transfer/log/components/logs'

const Log = (props) =>
  <li className={classes('d-flex align-items-baseline px-2 py-2 gap-2 border-bottom', props.className)}>
    <code className="fw-bold text-nowrap" style={{visibility: !props.line ? 'hidden' : undefined}}>
      {trans('line_number', {line: props.line || '0'}, 'transfer')}
    </code>

    <span className="ms-2" aria-hidden={true}>-</span>

    <Dot className="align-self-center" variant={classes({
      'success': 'success' === props.type,
      'warning': 'warning' === props.type,
      'danger': 'error' === props.type,
      'info': 'info' === props.type
    })} />

    <div className="fw-normal" role="presentation">
      {props.message}
    </div>

    <Datetime className="fs-sm text-body-secondary" value={props.date} time={true} />

    {props.link &&
      <Button
        type={URL_BUTTON}
        className="btn btn-link ms-auto"
        size="sm"
        label={trans('show', {}, 'actions')}
        target={props.link}
      />
    }
  </li>

Log.propTypes = {
  type: T.oneOf(['success', 'error', 'warning', 'info']),
  line: T.number,
  message: T.string.isRequired,
  date: T.string.isRequired,
  link: T.string
}

const ImportLog = (props) => {
  const [logType, setLogType] = useState('all')

  const logs = props.logs
    .filter(log => 'all' === logType || logType === log.type)

  return (
    <Logs />
  )

  return (
    <>
      <Logs />

      <div className="text-body-tertiary d-flex align-items-baseline justify-content-end mt-4 mb-1 me-n3">
        {trans('type')} :
        <Button
          type={MENU_BUTTON}
          className="btn btn-link fw-bold d-inline-flex align-items-center"
          label={trans(logType)}
          menu={{
            align: 'right',
            items: [
              {
                name: 'all',
                type: CALLBACK_BUTTON,
                label: trans('all'),
                active: 'all' === logType,
                callback: () => setLogType('all')
              }, {
                name: 'success',
                type: CALLBACK_BUTTON,
                label: trans('success'),
                active: 'success' === logType,
                callback: () => setLogType('success')
              }, {
                name: 'error',
                type: CALLBACK_BUTTON,
                label: trans('error'),
                active: 'error' === logType,
                callback: () => setLogType('error')
              }, {
                name: 'warning',
                type: CALLBACK_BUTTON,
                label: trans('warning'),
                active: 'warning' === logType,
                callback: () => setLogType('warning')
              }, {
                name: 'info',
                type: CALLBACK_BUTTON,
                label: trans('info'),
                active: 'info' === logType,
                callback: () => setLogType('info')
              }
            ]
          }}
        >
          <small className="ms-2 fa fa-caret-down" aria-hidden={true} />
        </Button>
      </div>

      {isEmpty(logs) &&
        <ContentPlaceholder
          //icon="fa fa-clipboard-list"
          title={trans('no_log', {}, 'transfer')}
          help={trans('no_log_help', {}, 'transfer')}
        />
      }

      {!isEmpty(logs) &&
        <ul className="list-unstyled">
          {logs.map((log, index) =>
            <Log {...log} className={0 === index ? 'border-top' : undefined}/>
          )}
        </ul>
      }
    </>
  )
}

ImportLog.propTypes = {
  logs: T.arrayOf(T.shape({
    type: T.oneOf(['success', 'error', 'warning', 'info']),
    line: T.number,
    message: T.string.isRequired,
    date: T.string.isRequired,
    link: T.string
  }))
}

ImportLog.defaultProps = {
  logs: []
}

export {
  ImportLog
}
