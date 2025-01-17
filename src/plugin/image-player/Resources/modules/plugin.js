import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineImagePlayerBundle', {
  resources: {
    'image': () => { return import(/* webpackChunkName: "plugin-image-resource-image" */ '#/plugin/image-player/resources/image') }
  }
})
