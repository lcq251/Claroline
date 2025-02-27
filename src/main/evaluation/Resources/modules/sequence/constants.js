
import {trans} from '#/main/app/intl/translation'

// TODO : maybe merge with quiz numbering
const NUMBERING_NONE    = 'none'
const NUMBERING_NUMERIC = 'numeric'
const NUMBERING_LITERAL = 'literal'
const NUMBERING_CUSTOM  = 'custom'

const PATH_NUMBERINGS = {
  [NUMBERING_NONE]: trans('numbering_none'),
  [NUMBERING_NUMERIC]: trans('numbering_numeric'),
  [NUMBERING_LITERAL]: trans('numbering_literal'),
  // [NUMBERING_CUSTOM]: trans('numbering_custom')
}

const STATUS_UNSEEN = 'unseen'

export const constants = {
  NUMBERING_NONE,
  NUMBERING_NUMERIC,
  NUMBERING_LITERAL,
  NUMBERING_CUSTOM,
  PATH_NUMBERINGS
}
