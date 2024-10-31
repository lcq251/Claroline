import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolinePrivacyBundle', {
  administration: {
    'privacy': () => {
      return import(/* webpackChunkName: "main-privacy-admin-privacy" */ '#/main/privacy/administration/privacy')
    }
  },
  account: {
    'tos'   : () => { return import(/* webpackChunkName: "main-privacy-account-privacy" */ '#/main/privacy/account/tos') },
    'privacy'   : () => { return import(/* webpackChunkName: "main-privacy-account-privacy" */ '#/main/privacy/account/privacy') }
  }
})
