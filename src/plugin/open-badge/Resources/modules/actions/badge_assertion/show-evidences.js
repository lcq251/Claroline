
import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_BADGE_EVIDENCES} from '#/plugin/open-badge/assertion/modals/evidences'

/**
 * Show assertion evidences.
 */
export default (assertions) => ({
  name: 'show-evidences',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-check-double',
  label: trans('show_evidences', {}, 'actions'),
  displayed: hasPermission('open', assertions[0]),
  modal: [MODAL_BADGE_EVIDENCES, {
    assertion: assertions[0]
  }],
  scope: ['object']
})
