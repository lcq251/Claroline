import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {CloseButton} from 'react-bootstrap'
import classes from 'classnames'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Toolbar, ActionTypes, PromisedActionTypes} from '#/main/app/action'
import {ModalEmpty} from '#/main/app/overlays/modal/components/empty'
import {Nav} from '#/main/app/components/nav'
import {Datetime} from '#/main/app/components/date'
import {UserMicro} from '#/main/core/user/components/micro'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'

import {constants} from '#/main/evaluation/constants'
import {EvaluationGauge} from '#/main/evaluation/components/gauge'
import {displayDuration} from '#/main/app/intl'
import {UserEvaluation as UserEvaluationTypes} from '#/main/evaluation/prop-types'

const UserProgressionModal = props => {
  const [section, changeSection] = useState('overview')

  return (
    <ModalEmpty
      {...omit(props, 'evaluation', 'actions')}
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
            <TooltipOverlay id="certified" tip="L'utilisateur obtient un certificate lorsqu'il termine/réussit cette évaluation." position="bottom">
              <div className="me-auto fw-bolder mb-3 mt-n2 fs-sm ms-n2 cursor-help">
                <span className="fa fa-certificate me-2" aria-hidden={true} />
                Formation Certifiée
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
            <div className="bg-body rounded-2 px-2 py-1 d-flex flex-row flex-nowrap align-items-center gap-2">
              <span className="fa fa-clock fs-base" aria-hidden={true} />
              {get(props.evaluation, 'duration') ?
                displayDuration(get(props.evaluation, 'duration')) : (get(props.evaluation, 'estimatedDuration') ? displayDuration(get(props.evaluation, 'estimatedDuration')) : '-')
              }
            </div>

            <div className="bg-body rounded-2 px-2 py-1 d-flex flex-row flex-nowrap align-items-center gap-2">
              <span className="fa fa-eye fs-base" aria-hidden={true} />
              20
            </div>

            <div className="bg-body rounded-2 px-2 py-1 d-flex flex-row flex-nowrap align-items-center gap-2">
              <span className="fa fa-rotate-right fs-base" aria-hidden={true} />
              3 / 4
            </div>
          </div>

          <ul className="list-unstyled mb-0 mt-4">
            <li>
              <b className="text-uppercase d-block fs-sm mb-1 text-nowrap">{trans('user')}</b>
              <UserMicro {...get(props.evaluation, 'user')} link={true} />
            </li>
            <li>
              <b className="text-uppercase d-block fs-sm mb-1 text-nowrap mt-4">{trans('last_activity_at')}</b>
              {get(props.evaluation, 'lastActivityAt') ?
                <Datetime value={get(props.evaluation, 'lastActivityAt')} time={true} long={true} /> :
                '-'
              }
            </li>
            <li>
              <b className="text-uppercase d-block fs-sm mb-1 text-nowrap mt-4">{trans('started_at')}</b>
              {get(props.evaluation, 'startedAt') ?
                <Datetime value={get(props.evaluation, 'startedAt')} time={true} long={true} /> :
                '-'
              }
            </li>
            <li>
              <b className="text-uppercase d-block fs-sm mb-1 text-nowrap mt-4">{trans('ended_at')}</b>
              {get(props.evaluation, 'endedAt') ?
                <Datetime value={get(props.evaluation, 'endedAt')} time={true} long={true} /> :
                '-'
              }
            </li>
          </ul>
        </div>
        <div className="flex-fill" role="presentation">
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

          <div className="modal-body pt-0">

          </div>
        </div>
      </div>
    </ModalEmpty>
  )
}

UserProgressionModal.propTypes = {
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
  fadeModal: T.func.isRequired
}

export {
  UserProgressionModal
}
