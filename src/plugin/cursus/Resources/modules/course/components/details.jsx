import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {currency, displayDateRange, trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {CALLBACK_BUTTON, MODAL_BUTTON, POPOVER_BUTTON} from '#/main/app/buttons'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {CourseParticipants} from '#/plugin/cursus/course/containers/participants'
import {CourseSessions} from '#/plugin/cursus/course/components/sessions'
import {CoursePending} from '#/plugin/cursus/course/containers/pending'
import {SessionParticipants} from '#/plugin/cursus/session/containers/participants'
import {
  canSelfRegister,
  getCourseRegistration,
  getInfo,
  getSessionRegistration,
  isFull,
  isFullyRegistered
} from '#/plugin/cursus/utils'
import {MODAL_COURSE_REGISTRATION} from '#/plugin/cursus/course/modals/registration'
import {route as workspaceRoute} from '#/main/core/workspace/routing'
import {PageAffix} from '#/main/app/page/components/affix'
import {PageSection, PageTabbedSection} from '#/main/app/page'
import {ContentHtml} from '#/main/app/content/components/html'
import {Button, Toolbar} from '#/main/app/action'
import {Badge} from '#/main/app/components/badge'
import {Content} from '#/main/app/components/content'
import {PageHeading} from '#/main/app/page/components/heading'
import {getActions} from '#/plugin/cursus/course/utils'
import {param} from '#/main/app/config'
import {Contact} from '#/main/app/components/contact'
import {nl2br} from '#/main/core/scaffolding/text'

const CourseAffix = (props) => {
  return (
    <div className="p-4 border rounded-3 shadow bg-body">
      {!props.registered && props.sessionFull &&
        <Badge
          variant="warning"
          subtle={true}
          className="fs-base lh-base mb-2 d-block w-100 py-2 px-3"
        >
          Complet
        </Badge>
      }

      {props.registered &&
        <Badge
          variant="success"
          subtle={true}
          className="fs-base lh-base mb-2 d-block w-100 py-2 px-3"
        >
          Inscrit
        </Badge>
      }

      <Toolbar
        className="d-grid gap-1 mb-3"
        buttonName="btn"
        primaryName="btn-primary"
        defaultName="btn-link"
        actions={props.actions}
      />
      {props.children}
    </div>
  )
}

CourseAffix.propTypes = {
  sessionFull: T.bool,
  registered: T.bool,
  actions: T.array
}

const CourseDetails = (props) => {
  const activeSessionRegistration = props.activeSession ? getSessionRegistration(props.activeSession, props.registrations) : null
  const courseRegistration = getCourseRegistration(props.registrations)

  const registered = !isEmpty(activeSessionRegistration) || !isEmpty(courseRegistration)
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
          sessionFull={props.activeSession && isFull(props.activeSession)}
          registered={registered}
          actions={actions}
        >
          <ul className="list-group list-group-flush list-group-values">
            <li className="list-group-item">
              {trans('public_registration')}
              <span className="value">
              {getInfo(props.course, props.activeSession, 'registration.selfRegistration') ? trans('yes') : trans('no')}
            </span>
            </li>

            <li className="list-group-item">
              {trans('available_seats', {}, 'cursus')}

              {!getInfo(props.course, props.activeSession, 'restrictions.users') &&
                <span className="value">{trans('not_limited', {}, 'cursus')}</span>
              }

              {getInfo(props.course, props.activeSession, 'restrictions.users') && !props.activeSession &&
                <span className="value">
                  {get(props.course, 'restrictions.users')}
                </span>
              }

              {getInfo(props.course, props.activeSession, 'restrictions.users') && props.activeSession &&
                <span className="value">
                  {(get(props.activeSession, 'restrictions.users') - get(props.activeSession, 'participants.learners')) + ' / ' + get(props.activeSession, 'restrictions.users')}
                </span>
              }
            </li>

            <li className="list-group-item">
              {trans('duration')}
              <span className="value">
                {getInfo(props.course, props.activeSession, 'meta.duration') ?
                  getInfo(props.course, props.activeSession, 'meta.duration') + ' ' + trans('hours') :
                  trans('empty_value')
                }
              </span>
            </li>

            {param('pricing.enabled') &&
              <li className="list-group-item">
                {trans('price')}
                <span className="value">
                  {getInfo(props.course, props.activeSession, 'pricing.price') || 0 === getInfo(props.course, props.activeSession, 'pricing.price') ?
                    currency(getInfo(props.course, props.activeSession, 'pricing.price')) :
                    trans('empty_value')
                  }
                  {getInfo(props.course, props.activeSession, 'pricing.description') &&
                    <Button
                      className="icon-with-text-left"
                      type={POPOVER_BUTTON}
                      icon="fa fa-fw fa-circle-info"
                      label={trans('show-info', {}, 'actions')}
                      tooltip="top"
                      popover={{
                        content: (
                          <ContentHtml>
                            {nl2br(getInfo(props.course, props.activeSession, 'pricing.description') || '')}
                          </ContentHtml>
                        ),
                        position: 'bottom'
                      }}
                    />
                  }
                </span>
              </li>
            }
          </ul>

          {get(props.activeSession, 'location') &&
            <>
              <h3 className="page-section-title h6 my-3">{trans('location')}</h3>
              <Contact {...props.activeSession.location} className="list-unstyled fw-bolder mb-0 text-body-secondary" />
            </>
          }
        </CourseAffix>
      }
    >
      {!isEmpty(props.course) &&
        <PageHeading
          size="md"
          title={get(props.course, 'name', trans('loading'))}
          description={get(props.course, 'plainDescription') }
          actions={!isEmpty(props.course) ? getActions([props.course], {
            add: () => props.reload(props.course.slug),
            update: () => props.reload(props.course.slug),
            delete: () => props.reload(props.course.slug)
          }, props.basePath, props.currentUser) : []}
        />
      }

      <PageSection size="md" className="mb-5">
        <div className="bg-body-tertiary rounded-3 p-3 mb-4 w-100 text-body-secondary d-flex flex-row align-items-stretch gap-4 fs-sm">
          {props.activeSession &&
            <>
              <div className="d-flex align-items-baseline flex-fill">
                <span className="fa fa-calendar-week me-3 fs-sm" aria-hidden={true} />
                <div className="" role="presentation">
                  <b className="text-uppercase d-block fs-sm mb-1 text-nowrap">Période de formation</b>
                  {displayDateRange(get(props.activeSession, 'restrictions.dates[0]'), get(props.activeSession, 'restrictions.dates[1]'))}
                </div>
              </div>
              <div className="vr" aria-hidden={true} />
            </>
          }

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
                  <ContentHtml className="text-wrap" align="start">{nl2br(props.course.certification)}</ContentHtml>
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
        />
      </PageSection>

      <PageTabbedSection
        className="mb-5"
        path={props.path}
        size="md"
        tabs={[
          {
            path: '',
            title: trans('about'),
            exact: true,
            render: () => (
              <div className="mt-3">
                <Content
                  placeholder={trans('no_description')}
                  tags={get(props.course, 'tags')}
                >
                  {get(props.course, 'description')}
                </Content>
              </div>
            )
          }, {
            path: '/sessions',
            title: trans('available_sessions', {}, 'cursus'),
            displayed: !get(props.course, 'display.hideSessions'),
            render: () => (
              <CourseSessions
                className="mt-3"
                contextType={props.contextType}
                path={props.path}
                basePath={props.basePath}
                course={props.course}
                registrations={props.registrations}
                reload={props.reload}
                register={props.register}
              />
            )
          }, {
            path: '/pending',
            title: trans('En attente'),
            displayed: hasPermission('register', props.course) && get(props.course, 'registration.pendingRegistrations'),
            render: () => (
              <CoursePending
                course={props.course}
              />
            )
          }, {
            path: '/participants',
            title: trans('participants'),
            displayed: hasPermission('register', props.course) || (props.activeSession && hasPermission('register', props.activeSession)),
            render: () => {
              if ('session' === props.participantsView) {
                return (
                  <SessionParticipants
                    path={props.path+'/participants'}
                    course={props.course}
                    activeSession={props.activeSession}
                    toggleVisibility={() => props.switchParticipantsView('course')}
                  />
                )
              }

              return (
                <CourseParticipants
                  path={props.path+'/participants'}
                  course={props.course}
                  activeSession={props.activeSession}
                  toggleVisibility={() => props.switchParticipantsView('session')}
                />
              )
            }
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
  registrations: T.shape({
    users: T.array.isRequired,
    groups: T.array.isRequired,
    pending: T.array.isRequired
  }),
  participantsView: T.string.isRequired,
  switchParticipantsView: T.func.isRequired,
  register: T.func.isRequired
}

export {
  CourseDetails
}
