import {trans} from '#/main/app/intl'
import {declareAccount} from '#/main/community/user'

import {AppearanceMain} from '#/main/theme/account/appearance/containers/main'

export default declareAccount(AppearanceMain, {
  name: 'appearance',
  title: trans('appearance', {}, 'tools'),
  help: trans('Ajoutez des champs personnalisés pour enrichir le profil de vos utilisateurs.'),
  group: trans('preferences')
})
