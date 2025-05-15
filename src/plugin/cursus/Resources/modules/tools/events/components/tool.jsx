import React from 'react'
import get from 'lodash/get'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Tool} from '#/main/core/tool'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Course} from '#/plugin/cursus/course/containers/main'
import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {CourseEditor} from '#/plugin/cursus/course/editor/containers/main'

import {EmptyCourse} from '#/plugin/cursus/course/components/empty'
import {Events} from '#/plugin/cursus/tools/events/components/events'
import {EventsDetails} from '#/plugin/cursus/tools/events/containers/details'
import {EventsPresences} from '#/plugin/cursus/tools/events/containers/presences'

const EventsTool = (props) =>
  <Tool
    {...props}
    /*redirect={[
      {from: '/', exact: true, to: (props.course && props.course.slug) ? '/course/' + props.course.slug : '/course'}
    ]}*/
    menu={[
      {
        name: 'overview',
        type: LINK_BUTTON,
        label: trans('about'),
        target: props.path,
        exact: true
      }, {
        name: 'course',
        type: LINK_BUTTON,
        label: trans('course', {}, 'cursus'),
        target: `${props.path}/course`
      }, {
        name: 'registered',
        type: LINK_BUTTON,
        label: trans('my_events', {}, 'cursus'),
        target: props.path + '/registered'
      }, {
        name: 'all',
        type: LINK_BUTTON,
        label: trans('all_events', {}, 'cursus'),
        target: props.path + '/all'
      }, {
        name: 'presences',
        type: LINK_BUTTON,
        label: (props.canEdit || props.canRegister) ? trans('presences', {}, 'cursus') : trans('my_presences', {}, 'cursus'),
        target: props.path + '/presences'
      }
    ]}
    pages={[
      {
        path: '/new',
        onEnter: () => props.openForm(null, CourseTypes.defaultProps, props.currentContext.data),
        disabled: !props.canEdit,
        render: () => (<CourseEditor isNew={true}/>)
      }, {
        path: `/course/${props.course.slug}/edit`,
        disabled: !props.canEdit,
        render: () => (
          <CourseEditor
            path={props.path}
            slug={props.course.slug}
          />
        )
      }, {
        path: '/course',
        onEnter: () => {
          if (props.course && props.course.slug) {
            return props.openCourse(props.course.slug)
          }
        },
        render: (params = {}) => {
          if (props.course && props.course.slug) {
            return (
              <Course
                slug={props.course.slug}
                history={params.history}
              />
            )
          }

          return (
            <EmptyCourse
              path={props.path}
              canEdit={props.canEdit}
              contextType={props.contextType}
              contextId={get(props.currentContext, 'data')}
              openForm={props.openForm}
            />
          )
        }
      }, {
        path: '/registered',
        onEnter: props.invalidateList,
        render: () => (
          <Events
            path={props.path}
            title={trans('my_events', {}, 'cursus')}
            url={['apiv2_cursus_my_events', {workspace: props.contextId}]}
          />
        )
      }, {
        path: '/all',
        onEnter: props.invalidateList,
        disabled: !props.canEdit && !props.canRegister,
        render: () => (
          <Events
            path={props.path}
            title={trans('all_events', {}, 'cursus')}
            url={props.canEdit || props.canRegister ?
              ['apiv2_cursus_event_list', {workspace: props.contextId}] :
              ['apiv2_cursus_event_public', {workspace: props.contextId}]
            }
          />
        )
      }, {
        path: '/presences',
        component: EventsPresences
      }, {
        path: '/:id',
        onEnter: (params = {}) => props.open(params.id),
        component: EventsDetails
      }
    ]}
  />

EventsTool.propTypes = {
  path: T.string.isRequired,
  currentContext: T.shape({
    type: T.string,
    data: T.object
  }).isRequired,
  contextType: T.string,
  canEdit: T.bool.isRequired,
  canRegister: T.bool.isRequired,
  invalidateList: T.func.isRequired,
  open: T.func.isRequired,
  openForm: T.func.isRequired,
  openCourse: T.func,
  course: T.shape({
    slug: T.string
  })
}

export {
  EventsTool
}
