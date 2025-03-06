/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the Evaluation plugin.
 */
registry.add('ClarolineEvaluationBundle', {
  /**
   * Provides Desktop and/or Workspace tools.
   */
  tools: {
    'progression': () => { return import(/* webpackChunkName: "evaluation-tool-progression" */ '#/main/evaluation/tools/evaluation') }
  },

  data: {
    types: {
      'score': () => { return import(/* webpackChunkName: "app-data-type-score" */ '#/main/evaluation/data/types/score') }
    },
    sources: {
      'resource_attempts'    : () => { return import(/* webpackChunkName: "evaluation-source-resource_attempts" */     '#/main/evaluation/data/sources/resource-attempts') },
      'resource_evaluations' : () => { return import(/* webpackChunkName: "evaluation-source-resource_evaluations" */  '#/main/evaluation/data/sources/resource-evaluations') },
      'my_resource_evaluations' : () => { return import(/* webpackChunkName: "evaluation-source-my_resource_evaluations" */  '#/main/evaluation/data/sources/my-resource-evaluations') },
      'workspace_evaluations': () => { return import(/* webpackChunkName: "evaluation-source-workspace_evaluations" */ '#/main/evaluation/data/sources/workspace-evaluations') },
      'my_workspace_evaluations': () => { return import(/* webpackChunkName: "evaluation-source-my_workspace_evaluations" */ '#/main/evaluation/data/sources/my-workspace-evaluations') }
    }
  },

  actions: {
    sequence: {
      'configure': () => { return import(/* webpackChunkName: "evaluation-action-sequence-configure" */ '#/main/evaluation/actions/sequence/configure') },
      'copy'     : () => { return import(/* webpackChunkName: "evaluation-action-sequence-copy" */      '#/main/evaluation/actions/sequence/copy') },
      'delete'   : () => { return import(/* webpackChunkName: "evaluation-action-sequence-delete" */    '#/main/evaluation/actions/sequence/delete') },
      'open'     : () => { return import(/* webpackChunkName: "evaluation-action-sequence-open" */      '#/main/evaluation/actions/sequence/open') },
      'publish'  : () => { return import(/* webpackChunkName: "evaluation-action-sequence-publish" */   '#/main/evaluation/actions/sequence/publish') },
      'unpublish': () => { return import(/* webpackChunkName: "evaluation-action-sequence-unpublish" */ '#/main/evaluation/actions/sequence/unpublish') },
      'show-dashboard': () => { return import(/* webpackChunkName: "evaluation-action-sequence-dashboard" */   '#/main/evaluation/actions/sequence/show-dashboard') }
    },

    resource_evaluation: {
      'open': () => { return import(/* webpackChunkName: "evaluation-action-resource_evaluation-open" */ '#/main/evaluation/actions/resource_evaluation/open') },
      'send-message': () => { return import(/* webpackChunkName: "evaluation-action-resource_evaluation-send-message" */ '#/main/evaluation/actions/resource_evaluation/send-message') },
      'show-profile': () => { return import(/* webpackChunkName: "evaluation-action-resource_evaluation-show-profile" */ '#/main/evaluation/actions/resource_evaluation/show-profile') }
    },

    sequence_evaluation: {
      'open': () => { return import(/* webpackChunkName: "evaluation-action-sequence_evaluation-open" */ '#/main/evaluation/actions/sequence_evaluation/open') },
      'send-message': () => { return import(/* webpackChunkName: "evaluation-action-sequence_evaluation-send-message" */ '#/main/evaluation/actions/sequence_evaluation/send-message') },
      'show-profile': () => { return import(/* webpackChunkName: "evaluation-action-sequence_evaluation-show-profile" */ '#/main/evaluation/actions/sequence_evaluation/show-profile') },
      'download-certificate': () => { return import(/* webpackChunkName: "evaluation-action-sequence_evaluation-certificate" */ '#/main/evaluation/actions/sequence_evaluation/download-certificate') },
      'regenerate-certificate': () => { return import(/* webpackChunkName: "evaluation-action-sequence_evaluation-regenerate-certificate" */ '#/main/evaluation/actions/sequence_evaluation/regenerate-certificate') },
      'delete': () => { return import(/* webpackChunkName: "evaluation-action-sequence_evaluation-delete" */ '#/main/evaluation/actions/sequence_evaluation/delete') },
      'recompute': () => { return import(/* webpackChunkName: "evaluation-action-sequence_evaluation-recompute" */ '#/main/evaluation/actions/sequence_evaluation/recompute') }
    },

    workspace_evaluation: {
      'open': () => { return import(/* webpackChunkName: "evaluation-action-workspace_evaluation-open" */ '#/main/evaluation/actions/workspace_evaluation/open') },
      'open-workspace': () => { return import(/* webpackChunkName: "evaluation-action-workspace_evaluation-open-ws" */ '#/main/evaluation/actions/workspace_evaluation/open-workspace') },
      'send-message': () => { return import(/* webpackChunkName: "evaluation-action-workspace_evaluation-send-message" */ '#/main/evaluation/actions/workspace_evaluation/send-message') },
      'show-profile': () => { return import(/* webpackChunkName: "evaluation-action-workspace_evaluation-show-profile" */ '#/main/evaluation/actions/workspace_evaluation/show-profile') },
      'download-certificate': () => { return import(/* webpackChunkName: "evaluation-action-workspace_evaluation-certificate" */ '#/main/evaluation/actions/workspace_evaluation/download-certificate') },
      'regenerate-certificate': () => { return import(/* webpackChunkName: "evaluation-action-workspace_evaluation-regenerate-certificate" */ '#/main/evaluation/actions/workspace_evaluation/regenerate-certificate') },
    }
  }
})
