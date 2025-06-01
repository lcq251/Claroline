import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {CloseButton} from 'react-bootstrap'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {url} from '#/main/app/api'
import {trans, displayDuration} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Toolbar, ActionTypes, PromisedActionTypes} from '#/main/app/action'
import {ModalEmpty} from '#/main/app/overlays/modal/components/empty'
import {Nav} from '#/main/app/components/nav'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'

import {constants} from '#/main/evaluation/constants'
import {EvaluationGauge} from '#/main/evaluation/components/gauge'
import {UserEvaluation as UserEvaluationTypes} from '#/main/evaluation/prop-types'
import {DescriptionList} from '#/main/app/data/components/description-list'

const UserProgressionModal = props => {
  const [section, changeSection] = useState('overview')

  useEffect(() => {
    if (!isEmpty(props.url)) {
      props.fetchUserProgression(props.url)
    }

    return () => {
      props.resetUserProgression()
    }
  }, [url(props.url)])

  return (
    <ModalEmpty
      {...omit(props, 'evaluation', 'actions', 'additional', 'fetchUserProgression', 'resetUserProgression')}
      size="xl"
    >
      <div className="d-flex flex-row" role="presentation">
        <div
          className={classes('modal-aside bg-body-tertiary p-4 rounded-start-3 d-flex flex-column w-100',
          `text-${constants.EVALUATION_STATUS_COLOR[get(props.evaluation, 'status')]}-emphasis`,
          `bg-${constants.EVALUATION_STATUS_COLOR[get(props.evaluation, 'status')]}-subtle`
          )}
          style={{maxWidth: '16rem'}}
        >
          {props.evaluation.certified &&
            <TooltipOverlay id="certified" tip={trans('certified_help', {}, 'evaluation')} position="bottom">
              <div className="me-auto fw-bolder mb-3 mt-n2 fs-sm ms-n2 cursor-help">
                <span className="fa fa-certificate me-2" aria-hidden={true} />
                {trans('certified', {}, 'evaluation')}
              </div>
            </TooltipOverlay>
          }

          <EvaluationGauge
            className="mx-auto"
            status={constants.EVALUATION_STATUS_NOT_ATTEMPTED}
            size="lg"
            {...props.evaluation}
          />

          {props.actions &&
            <Toolbar
              className="mx-auto"
              buttonName={classes('btn btn-text-body text-reset', `focus-ring-${constants.EVALUATION_STATUS_COLOR[get(props.evaluation, 'status')]}`)}
              tooltip="bottom"
              actions={props.actions}
            />
          }

          <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
            {[
              {
                icon: 'fa fa-clock',
                value: get(props.evaluation, 'duration') ? displayDuration(get(props.evaluation, 'duration')) : null,
                label: trans('duration'),
                displayed: !!get(props.evaluation, 'duration')
              }, {
                icon: 'fa fa-clock',
                label: trans('estimated_duration'),
                value: get(props.evaluation, 'estimatedDuration') ? displayDuration(get(props.evaluation, 'estimatedDuration')) : '-',
                displayed: !get(props.evaluation, 'duration')
              }
            ].concat(props.additional || [])
              .filter(info => undefined === info.displayed || info.displayed)
              .map(info =>
                <TooltipOverlay tip={info.label} key={info.label} position="bottom">
                  <div className="bg-body rounded-2 px-2 py-1 d-flex flex-row flex-nowrap align-items-center gap-2">
                    <span className={info.icon} aria-hidden={true} />
                    {info.value}
                  </div>
                </TooltipOverlay>
              )
            }
          </div>

          <DescriptionList
            className="border-top-0 border-bottom-0 mb-0 mt-2"
            data={props.evaluation}
            variant={constants.EVALUATION_STATUS_COLOR[get(props.evaluation, 'status')]}
            fields={[
              {
                name: 'user',
                type: 'user',
                label: trans('user')
              }, {
                name: 'lastActivityAt',
                type: 'date',
                label: trans('last_activity_at'),
                options: {long: true, time: true},
                placeholder: '-'
              }, {
                name: 'startedAt',
                type: 'date',
                label: trans('started_at'),
                options: {long: true, time: true},
                placeholder: '-'
              }, {
                name: 'endedAt',
                type: 'date',
                label: trans('ended_at'),
                options: {long: true, time: true},
                placeholder: '-'
              }
            ]}
          />
        </div>

        <div className="flex-fill d-flex flex-column" role="presentation">
          <div className="modal-header">
            <Nav
              orientation="horizontal"
              variant="underline"
              items={[
                {
                  name: 'overview',
                  type: CALLBACK_BUTTON,
                  label: trans('overview'),
                  active: 'overview' === section,
                  callback: () => changeSection('overview')
                }, {
                  name: 'stats',
                  type: CALLBACK_BUTTON,
                  label: trans('statistics'),
                  active: 'stats' === section,
                  callback: () => changeSection('stats')
                }, {
                  name: 'activity',
                  type: CALLBACK_BUTTON,
                  label: trans('activity'),
                  active: 'activity' === section,
                  callback: () => changeSection('activity')
                }
              ]}
            />

            <CloseButton onClick={props.fadeModal} aria-label={trans('close', {}, 'actions')} />
          </div>

          <div className="modal-body d-flex flex-column pt-0">
            {props.children}
          </div>
        </div>
      </div>
    </ModalEmpty>
  )
}

UserProgressionModal.propTypes = {
  // the api URL to fetch the user evaluation and progression
  url: T.oneOfType([T.string, T.array]).isRequired,
  evaluation: T.shape(
    UserEvaluationTypes.propTypes
  ).isRequired,
  actions: T.oneOfType([
    // a regular array of actions
    T.arrayOf(T.shape(
      ActionTypes.propTypes
    )),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedActionTypes.propTypes
    )
  ]),
  additional: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    label: T.string.isRequired,
    value: T.any.isRequired
  })),
  fetchUserProgression: T.func.isRequired,
  resetUserProgression: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  UserProgressionModal
}
