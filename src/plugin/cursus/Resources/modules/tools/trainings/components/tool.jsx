import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Tool} from '#/main/core/tool'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {EventMain} from '#/plugin/cursus/tools/trainings/event/containers/main'
import {CatalogMain} from '#/plugin/cursus/tools/trainings/catalog/containers/main'
import {SessionMain} from '#/plugin/cursus/tools/trainings/session/containers/main'
import {TrainingsEditor} from '#/plugin/cursus/tools/trainings/editor/containers/main'
import {TrainingsOverview} from '#/plugin/cursus/tools/trainings/components/overview'
import {MODAL_TRAINING_COMMANDS} from '#/plugin/cursus/tools/trainings/modals/commands'
import {TrainingsDashboard} from '#/plugin/cursus/tools/trainings/dashboard/components/main'

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
      }, {
        name: 'dashboard',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-gauge',
        label: trans('Suivi'),
        tooltip: 'bottom',
        target: props.path + '/dashboard',
        displayed: props.canRegister
      }
    ]}
    actions={[
      /*{
        name: 'search',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-search',
        label: trans('search', {}, 'actions'),
        modal: [MODAL_TRAINING_COMMANDS]
      }*/
    ]}
    pages={[
      {
        path: '/',
        component: TrainingsOverview,
        exact: true
      }, {
        path: '/dashboard',
        component: TrainingsDashboard,
        disabled: !props.canRegister
      }, {
        path: '/course',
        component: CatalogMain
      }, {
        path: '/sessions',
        component: SessionMain
      }, {
        path: '/events',
        component: EventMain
      }
    ]}
    editor={TrainingsEditor}
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
