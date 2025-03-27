import {createElement} from 'react'

import {trans} from '#/main/app/intl/translation'
import {chain, string, email, notExist} from '#/main/app/data/types/validators'

import {EmailDisplay} from '#/main/app/data/types/email/components/display'
import {EmailInput} from '#/main/app/data/types/email/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'email',
  meta: {
    icon: 'fa fa-fw fa-at',
    label: trans('email', {}, 'data'),
    description: trans('email_desc', {}, 'data'),
    creatable: true
  },
  render: (raw) => createElement('a', {href: `mailto:${raw}`}, raw),
  validate: (value, options) => {
    if (options.unique && !options.unique.error) {
      options.unique.error = trans('This email already exists.', {}, 'validators')
    }

    return chain(value, options, [string, email, notExist])
  },
  components: {
    input: EmailInput,
    display: EmailDisplay
  }
})
