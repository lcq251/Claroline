/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the Template plugin.
 */
registry.add('ClarolineTemplateBundle', {
  /**
   * Provides Administration tools.
   */
  administration: {
    'templates': () => { return import(/* webpackChunkName: "template-admin-templates" */ '#/main/template/administration/templates') }
  },

  data: {
    types: {
      'template': () => { return import(/* webpackChunkName: "template-data-type-template" */ '#/main/template/data/types/template') }
    }
  }
})
