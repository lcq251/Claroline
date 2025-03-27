import tinycolor from 'tinycolor2'

import {trans} from '#/main/app/intl/translation'

import {string} from '#/main/app/data/types/validators'

function color(value) {
  if (string(value)) {
    return string(value)
  }

  const colorObj = tinycolor(value)
  if (!colorObj.isValid()) {
    return trans('This value should be a valid color.', {}, 'validators')
  }
}

export {
  color
}
