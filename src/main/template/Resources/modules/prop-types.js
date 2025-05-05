import {PropTypes as T} from 'prop-types'

const TemplateType = {
  propTypes: {
    name: T.string.isRequired,
    type: T.string,
    samples: T.array,
    placeholders: T.array
  }
}

const Template = {
  propTypes: {
    id: T.string,
    name: T.string,
    type: T.string,
    description: T.string,
    system: T.bool,
    default: T.bool
  }
}

const TemplateContent = {
  propTypes: {
    lang: T.string.isRequired,
    title: T.string,
    content: T.string
  }
}

export {
  Template,
  TemplateContent,
  TemplateType
}
