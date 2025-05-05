import {trans} from '#/main/app/intl'

const NUMBERING_NONE    = 'none'
const NUMBERING_NUMERIC = 'numeric'
const NUMBERING_LITERAL = 'literal'

const NUMBERINGS = {
  [NUMBERING_NONE]: trans('numbering_none'),
  [NUMBERING_NUMERIC]: {
    label: trans('numbering_numeric'),
    description: trans('numbering_numeric_help')
  },
  [NUMBERING_LITERAL]: {
    label: trans('numbering_literal'),
    description: trans('numbering_literal_help')
  }
}

export {
  NUMBERINGS,
  NUMBERING_NONE,
  NUMBERING_NUMERIC,
  NUMBERING_LITERAL
}
