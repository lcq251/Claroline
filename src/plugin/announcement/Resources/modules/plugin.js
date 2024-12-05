/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineAnnouncementBundle', {
  tools: {
    'announcement': () => { return import(/* webpackChunkName: "announcement-tool-announcement" */ '#/plugin/announcement/tools/announcement') }
  },

  data: {
    sources: {
      'announcements' : () => { return import(/* webpackChunkName: "announcement-data-announcements" */  '#/plugin/announcement/data/sources/announcements') }
    }
  }
})
