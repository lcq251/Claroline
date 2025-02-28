import {trans} from '#/main/app/intl'

const NUMBERING_NONE    = 'none'
const NUMBERING_NUMERIC = 'numeric'
const NUMBERING_LITERAL = 'literal'

const NUMBERINGS = {
  [NUMBERING_NONE]: trans('numbering_none'),
  [NUMBERING_NUMERIC]: trans('numbering_numeric'),
  [NUMBERING_LITERAL]: trans('numbering_literal')
}

export {
  NUMBERINGS,
  NUMBERING_NONE,
  NUMBERING_NUMERIC,
  NUMBERING_LITERAL
}
