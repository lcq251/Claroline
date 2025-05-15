import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {CourseParticipants} from '#/plugin/cursus/course/components/participants'
import {CourseSessions} from '#/plugin/cursus/course/components/sessions'
import {
  canSelfRegister,
  getInfo,
  getSessionRegistration,
  isFull,
  isFullyRegistered
} from '#/plugin/cursus/utils'
import {MODAL_COURSE_REGISTRATION} from '#/plugin/cursus/course/modals/registration'
import {route as workspaceRoute} from '#/main/core/workspace/routing'
import {PageAffix} from '#/main/app/page/components/affix'
import {PageSection, PageTabbedSection} from '#/main/app/page'
import {Toolbar} from '#/main/app/action'
import {Content} from '#/main/app/components/content'
import {PageHeading} from '#/main/app/page/components/heading'
import {getActions} from '#/plugin/cursus/course/utils'
import {nl2br} from '#/main/app/utils/text'
import {Html} from '#/main/app/components/html'
import {CourseAffix} from '#/plugin/cursus/course/components/affix'
import {CourseStats} from '#/plugin/cursus/course/components/stats'

const CourseDetails = (props) => {
  const activeSessionRegistration = props.activeSession ? getSessionRegistration(props.activeSession, props.registrations) : null

  const registered = !isEmpty(props.registrations)
  let selfRegistration = !registered
    && (!isEmpty(props.activeSession) || !isEmpty(props.availableSessions) || get(props.course, 'registration.pendingRegistrations'))

  if (props.activeSession) {
    selfRegistration = selfRegistration && canSelfRegister(props.course, props.activeSession, props.registrations)
  }

  const actions = [
    {
      name: 'self-register',
      type: MODAL_BUTTON,
      label: trans('Commencer mon inscription', {}, 'actions'),
      modal: [MODAL_COURSE_REGISTRATION, {
        course: props.course,
        session: props.activeSession,
        available: props.availableSessions,
        register: props.register
      }],
      primary: true,
      displayed: selfRegistration
    }, {
      name: 'open',
      type: CALLBACK_BUTTON,
      label: trans('open-training', {}, 'actions'),
      callback: () => {
        const workspaceUrl = workspaceRoute(getInfo(props.course, props.activeSession, 'workspace'))
        if (get(props.activeSession, 'registration.autoRegistration') && !isFullyRegistered(activeSessionRegistration)) {
          props.register(props.course, props.activeSession.id).then(() => props.history.push(workspaceUrl))
        } else {
          props.history.push(workspaceUrl)
        }
      },
      displayed: (isFullyRegistered(activeSessionRegistration)
          || get(props.activeSession, 'registration.autoRegistration')
          || hasPermission('edit', props.course))
        && !isEmpty(getInfo(props.course, props.activeSession, 'workspace'))
      /*&& props.contextType !== 'workspace'*/,
      primary: !selfRegistration
    }, {
      name: 'download',
      label: trans('download_training', {}, 'actions'),
      type: CALLBACK_BUTTON,
      callback: () => true
    }
  ]

  return (
    <PageAffix
      affix={
        <CourseAffix
          course={props.course}
          activeSession={props.activeSession}
          sessionFull={props.activeSession && isFull(props.activeSession)}
          registered={registered}
          actions={actions}
        />
      }
    >
      <PageHeading
        title={get(props.course, 'name', trans('loading'))}
        description={get(props.course, 'plainDescription')}
        primaryAction="edit"
        actions={!isEmpty(props.course) ? getActions([props.course], {
          add: () => props.reload(props.course.slug),
          update: () => props.reload(props.course.slug),
          delete: () => props.reload(props.course.slug)
        }, props.path, props.currentUser) : []}
      />

      <PageSection className="mb-5">
        <div className="bg-body-tertiary rounded-3 p-3 mb-4 w-100 text-body-secondary d-flex flex-row align-items-stretch gap-4 fs-sm">
          <div className="d-flex align-items-baseline flex-fill">
            <span className="fa fa-clock me-3 fs-sm" aria-hidden={true} />
            <div className="" role="presentation">
              <b className="text-uppercase d-block fs-sm mb-1 text-nowrap">Durée de la formation</b>
              {getInfo(props.course, props.activeSession, 'meta.duration') + ' ' + trans('hours')}
            </div>
          </div>

          {get(props.course, 'certification') &&
            <>
              <div className="vr" aria-hidden={true} />
              <div className="d-flex align-items-baseline flex-fill">
                <span className="fa fa-graduation-cap me-3 fs-sm" aria-hidden={true} />
                <div className="" role="presentation">
                  <b className="text-uppercase d-block fs-sm mb-1">Certification</b>
                  <Html className="text-wrap" align="start">{nl2br(props.course.certification)}</Html>
                </div>
              </div>
            </>
          }
        </div>

        <Toolbar
          className="d-flex gap-1"
          buttonName="btn"
          primaryName="btn-primary"
          defaultName="btn-link"
          actions={actions}
          size="lg"
        />
      </PageSection>

      <PageTabbedSection
        className="mb-5"
        tabs={[
          {
            name: 'about',
            title: trans('about'),
            render: () => (
              <div className="mt-4" role="presentation">
                <Content
                  placeholder={trans('no_description')}
                  tags={get(props.course, 'tags')}
                >
                  {get(props.course, 'description')}
                </Content>
              </div>
            )
          }, {
            name: 'sessions',
            title: trans('available_sessions', {}, 'cursus'),
            displayed: (!get(props.course, 'display.hideSessions') && 0 !== props.availableSessions.length) || hasPermission('edit', props.course),
            badge: props.availableSessions.length,
            render: () => (
              <CourseSessions
                path={props.path}
                course={props.course}
                availableSessions={props.availableSessions}
                reload={props.reload}
              />
            )
          }, {
            name: 'participants',
            title: trans('participants'),
            displayed: hasPermission('register', props.course),
            render: () => {
              return (
                <CourseParticipants
                  path={props.path}
                  course={props.course}
                />
              )
            }
          }, {
            name: 'stats',
            title: trans('Suivi'),
            onEnter: () => props.loadStats(props.course.id),
            displayed: !isEmpty(get(props.course, 'registration.form')) && hasPermission('register', props.course),
            render: () => (
              <CourseStats
                course={props.course}
                stats={props.stats}
                loadStats={props.loadStats}
              />
            )
          }
        ]}
      />
    </PageAffix>
  )
}

CourseDetails.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  availableSessions: T.arrayOf(T.shape(
    SessionTypes.propTypes
  )),
  contextType: T.string.isRequired,
  registrations: T.arrayOf(T.shape({
    // SessionUser
  })),
  stats: T.object,
  register: T.func.isRequired,
  loadStats: T.func.isRequired
}

CourseDetails.defaultProps = {
  availableSessions: []
}

export {
  CourseDetails
}
