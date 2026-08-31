import {registry} from '#/main/app/plugins/registry'

registry.add('MindmeMdhomeBundle', {
  widgets: {
    'landing-hero'      : () => { return import(/* webpackChunkName: "mindme-landing-hero" */      '#/integration/mindme-mdhome/widgets/landing/hero') },
    'landing-features'  : () => { return import(/* webpackChunkName: "mindme-landing-features" */  '#/integration/mindme-mdhome/widgets/landing/features') },
    'landing-packaging' : () => { return import(/* webpackChunkName: "mindme-landing-packaging" */ '#/integration/mindme-mdhome/widgets/landing/packaging') }
  }
})