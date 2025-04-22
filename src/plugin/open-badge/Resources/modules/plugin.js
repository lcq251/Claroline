/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineOpenBadgeBundle', {
  data: {
    types: {
      'badge-rules' : () => { return import(/* webpackChunkName: "badge-data-badge-rules" */  '#/plugin/open-badge/data/types/badge-rules') }
    },
    sources: {
      'badges'   : () => { return import(/* webpackChunkName: "badge-source-badges" */    '#/plugin/open-badge/data/sources/badges') },
      'my_badges': () => { return import(/* webpackChunkName: "badge-source-my-badges" */ '#/plugin/open-badge/data/sources/my-badges') }
    }
  },

  actions: {
    badge: {
      'open'       : () => { return import(/* webpackChunkName: "badge-action-badge-open" */        '#/plugin/open-badge/actions/badge/open') },
      'edit'       : () => { return import(/* webpackChunkName: "badge-action-badge-edit" */        '#/plugin/open-badge/actions/badge/edit') },
      'delete'     : () => { return import(/* webpackChunkName: "badge-action-badge-delete" */      '#/plugin/open-badge/actions/badge/delete') },
      'grant'      : () => { return import(/* webpackChunkName: "badge-action-badge-grant" */       '#/plugin/open-badge/actions/badge/grant') },
      'archive'    : () => { return import(/* webpackChunkName: "badge-action-badge-enable" */      '#/plugin/open-badge/actions/badge/archive') },
      'unarchive'  : () => { return import(/* webpackChunkName: "badge-action-badge-disable" */     '#/plugin/open-badge/actions/badge/unarchive') },
      'recalculate': () => { return import(/* webpackChunkName: "badge-action-badge-recalculate" */ '#/plugin/open-badge/actions/badge/recalculate') }
    },
    badge_assertion: {
      'open'          : () => { return import(/* webpackChunkName: "badge-action-badge_assertion-open" */           '#/plugin/open-badge/actions/badge_assertion/open') },
      'download'      : () => { return import(/* webpackChunkName: "badge-action-badge_assertion-download" */       '#/plugin/open-badge/actions/badge_assertion/download') },
      'delete'        : () => { return import(/* webpackChunkName: "badge-action-badge_assertion-delete" */         '#/plugin/open-badge/actions/badge_assertion/delete') },
      'show-evidences': () => { return import(/* webpackChunkName: "badge-action-badge_assertion-show-evidences" */ '#/plugin/open-badge/actions/badge_assertion/show-evidences') }
    }
  },

  /**
   * Provides Administration tools.
   */
  tools: {
    'badges': () => { return import(/* webpackChunkName: "badge-tool-badges" */ '#/plugin/open-badge/tools/badges') }
  },

  /**
   * Provides tabs for the user profile.
   */
  profile: {
    'badges': () => { return import(/* webpackChunkName: "open-badge-profile-badges" */ '#/plugin/open-badge/profile/badges') }
  }
})
