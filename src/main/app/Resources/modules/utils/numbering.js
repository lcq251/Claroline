import {trans} from '#/main/app/intl'

const NUMBERING_NONE    = 'none'
const NUMBERING_NUMERIC = 'numeric'
const NUMBERING_LITERAL = 'literal'
const NUMBERING_CUSTOM  = 'custom'

const NUMBERINGS = {
  [NUMBERING_NONE]: trans('numbering_none'),
  [NUMBERING_NUMERIC]: trans('numbering_numeric'),
  [NUMBERING_LITERAL]: trans('numbering_literal'),
  // [NUMBERING_CUSTOM]: trans('numbering_custom')
}