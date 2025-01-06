import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Tool} from '#/main/core/tool'
import {LINK_BUTTON} from '#/main/app/buttons'

import {EventMain} from '#/plugin/cursus/tools/trainings/event/containers/main'
import {CatalogMain} from '#/plugin/cursus/tools/trainings/catalog/containers/main'
import {SessionMain} from '#/plugin/cursus/tools/trainings/session/containers/main'
import {TrainingsEditor} from '#/plugin/cursus/tools/trainings/editor/containers/main'
import {TrainingsOverview} from '#/plugin/cursus/tools/trainings/components/overview'
import {TrainingsDashboard} from '#/plugin/cursus/tools/trainings/dashboard/components/main'
import {TrainingsRegistration} from '#/plugin/cursus/tools/trainings/registration/components/main'

const TrainingsTool = (props) =>
  <Tool
    {...props}
    menu={[
      {
        name: 'overview',
        type: LINK_BUTTON,
        label: trans('about'),
        target: props.path+'/',
        exact: true
      }, {
        name: 'catalog',
        type: LINK_BUTTON,
        label: trans('catalog', {}, 'cursus'),
        target: props.path+'/course'
      }, {
        name: 'sessions',
        type: LINK_BUTTON,
        label: trans('sessions', {}, 'cursus'),
        target: props.path + '/sessions',
        displayed: props.canRegister
      }, {
        name: 'events',
        type: LINK_BUTTON,
        label: trans('session_events', {}, 'cursus'),
        target: props.path + '/events',
        displayed: props.canRegister
      }, {
        name: 'registrations',
        type: LINK_BUTTON,
        label: trans('registrations', {}, 'cursus'),
        target: props.path + '/registrations',
        displayed: props.canRegister
      }
    ]}
    pages={[
      {
        path: '/',
        component: TrainingsOverview,
        exact: true
      }, {
        path: '/course',
        component: CatalogMain
      }, {
        path: '/sessions',
        component: SessionMain,
        disabled: !props.canRegister
      }, {
        path: '/events',
        component: EventMain,
        disabled: !props.canRegister
      }, {
        path: '/registrations',
        component: TrainingsRegistration,
        disabled: !props.canRegister
      }
    ]}
    editor={TrainingsEditor}
    dashboard={TrainingsDashboard}
  />

TrainingsTool.propTypes = {
  authenticated: T.bool.isRequired,
  canEdit: T.bool.isRequired,
  canRegister: T.bool.isRequired,
  path: T.string.isRequired
}

export {
  TrainingsTool
}
