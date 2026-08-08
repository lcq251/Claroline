/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the Home plugin.
 */
registry.add('ClarolineHomeBundle', {
  /**
   * Provides tab types for Home tools.
   */
  home: {
    'widgets': () => { return import(/* webpackChunkName: "home-home-widgets" */ '#/plugin/home/home/widgets') }
  },

  /**
   * Provides new Widgets for homes.
   */
  widgets: {
    'landing-hero'     : () => { return import(/* webpackChunkName: "home-landing-hero" */      '#/plugin/home/home/widgets/landing/hero') },
    'landing-features' : () => { return import(/* webpackChunkName: "home-landing-features" */  '#/plugin/home/home/widgets/landing/features') },
    'landing-ai'       : () => { return import(/* webpackChunkName: "home-landing-ai" */        '#/plugin/home/home/widgets/landing/ai') },
    'landing-packaging': () => { return import(/* webpackChunkName: "home-landing-packaging" */ '#/plugin/home/home/widgets/landing/packaging') },
    'landing-cta'      : () => { return import(/* webpackChunkName: "home-landing-cta" */       '#/plugin/home/home/widgets/landing/cta') }
  },

  /**
   * Provides Desktop and/or Workspace tools.
   */
  tools: {
    'home': () => { return import(/* webpackChunkName: "home-tool-home" */ '#/plugin/home/tools/home') }
  },

  /**
   * Provides Administration tools.
   */
  administration: {
    'home': () => { return import(/* webpackChunkName: "home-tool-home" */ '#/plugin/home/tools/home') }
  }
})
