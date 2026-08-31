import {registry} from '#/main/app/plugins/registry'

registry.add('MindmeDigitalBundle', {
  resources: {
    digital_teacher: () => import(/* webpackChunkName: "mindme-digital-teacher" */ '#/integration/mindme-digital/resources/digital-teacher')
  }
})