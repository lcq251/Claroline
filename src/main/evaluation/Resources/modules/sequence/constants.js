
import {trans} from '#/main/app/intl/translation'

// TODO : maybe merge with quiz numbering
const NUMBERING_NONE    = 'none'
const NUMBERING_NUMERIC = 'numeric'
const NUMBERING_LITERAL = 'literal'
const NUMBERING_CUSTOM  = 'custom'

const PATH_NUMBERINGS = {
  [NUMBERING_NONE]: trans('path_numbering_none', {}, 'path'),
  [NUMBERING_NUMERIC]: trans('path_numbering_numeric', {}, 'path'),
  [NUMBERING_LITERAL]: trans('path_numbering_literal', {}, 'path'),
  // [NUMBERING_CUSTOM]: trans('path_numbering_custom', {}, 'path')
}

const STATUS_UNSEEN = 'unseen'

export const constants = {
  NUMBERING_NONE,
  NUMBERING_NUMERIC,
  NUMBERING_LITERAL,
  NUMBERING_CUSTOM,
  PATH_NUMBERINGS
}
