import {declareTool, CommandPalette} from '#/main/core/tool'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

import {TrainingsTool} from '#/plugin/cursus/tools/trainings/containers/tool'
import {hasPermission} from '#/main/app/security'

export default declareTool(TrainingsTool, (tool) => new CommandPalette('trainings')
  .addPages([
    {
      name: 'catalog',
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-graduation-cap',
      label: trans('catalog', {}, 'cursus'),
      target: '/trainings/course'
    }, {
      name: 'sessions',
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-calendar-week',
      label: trans('sessions', {}, 'cursus'),
      target: '/trainings/sessions',
      displayed: hasPermission('follow', tool)
    }, {
      name: 'events',
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-calendar-day',
      label: trans('session_events', {}, 'cursus'),
      target: '/trainings/events',
      displayed: hasPermission('follow', tool)
    }, {
      name: 'registrations',
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-user-plus',
      label: trans('registrations', {}, 'cursus'),
      target: '/trainings/registrations',
      displayed: hasPermission('follow', tool)
    }, {
      name: 'dashboard',
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-gauge',
      label: trans('dashboard'),
      target: '/trainings/dashboard',
      displayed: hasPermission('follow', tool)
    }
  ])
  .addCommands([
    {
      name: 'add-course',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-graduation-cap',
      label: trans('Ajouter une formation', {}, 'command'),
      callback: () => true
    }, {
      name: 'add-session',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-calendar-week',
      label: trans('Planifier une session', {}, 'command'),
      callback: () => true
    }, {
      name: 'add-event',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-calendar-day',
      label: trans('Planifier une séance', {}, 'command'),
      callback: () => true
    }, {
      name: 'register',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-user-plus',
      label: trans('Inscrire des utilisateurs', {}, 'command'),
      callback: () => true
    }, {
      name: 'validate-pending',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-user-check',
      label: trans('Valider les inscriptions en attente', {}, 'command'),
      callback: () => true
    }, {
      name: 'validate-presences',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-list-check',
      label: trans('Valider les présences', {}, 'command'),
      callback: () => true
    }
  ])
).addPermissions({
  follow: {
    order: 5,
    actions: [
      'Inscrire des utilisateurs aux formations',
      'Gérer les inscriptions des utilisateurs'
    ]
  },
  edit: {
    order: 10,
    actions: [
      'Créer et administrer de nouvelles formations',
      'Créer et administrer de nouvelles sessions',
      'Créer et administrer de nouvelles séances',
      'Administrer toutes les formations'
    ]
  }
})
