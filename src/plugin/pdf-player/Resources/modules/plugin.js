import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolinePdfPlayerBundle', {
  resources: {
    'pdf': () => { return import(/* webpackChunkName: "plugin-pdf-resource-pdf" */ '#/plugin/pdf-player/resources/pdf') }
  }
})
