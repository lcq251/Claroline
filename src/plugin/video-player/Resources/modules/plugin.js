/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

/**
 * Declares applications provided by the VideoPlayer plugin.
 */
registry.add('ClarolineVideoPlayerBundle', {
  resources: {
    'video': () => { return import(/* webpackChunkName: "plugin-video-resource-video" */ '#/plugin/video-player/resources/video') }
  }
})
