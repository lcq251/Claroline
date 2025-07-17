import { trans } from '#/main/app/intl/translation'

const CONTENT_TYPES = ['text', 'image', 'video', 'audio']

const generateInputForType = (prefix, contentType) => {
  if (contentType === 'text') {
    return {
      name: `${prefix}Content`,
      label: trans('text'),
      type: 'html',
      required: true,
      hideLabel: true,
      displayed: (card) => card[`${prefix}ContentType`] === 'text'
    }
  }

  return {
    name: `${prefix}Content`,
    type: 'file',
    label: trans(contentType),
    hideLabel: true,
    displayed: (card) => card[`${prefix}ContentType`] === contentType,
    required: true,
    options: {
      types: [`${contentType}/*`]
    }
  }
}

export const generateInputFields = (prefix) => {
  return CONTENT_TYPES.map(type => generateInputForType(prefix, type))
}
