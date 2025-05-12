import {trans} from '#/main/app/intl'

const PAGINATION_NONE = 'none';
const PAGINATION_PAGE = 'page';
const PAGINATION_ALL = 'all';

const PAGINATIONS = {
  [PAGINATION_NONE]: {
    label: trans('sequence_pagination_none', {}, 'evaluation'),
    description: trans('sequence_pagination_none_help', {}, 'evaluation')
  },
  [PAGINATION_PAGE]: {
    label: trans('sequence_pagination_step', {}, 'evaluation'),
    description: trans('sequence_pagination_step_help', {}, 'evaluation')
  },
  [PAGINATION_ALL]: {
    label: trans('sequence_pagination_all', {}, 'evaluation'),
    description: trans('sequence_pagination_all_help', {}, 'evaluation')
  }
}

export const constants = {
  PAGINATIONS,
  PAGINATION_NONE,
  PAGINATION_PAGE,
  PAGINATION_ALL
}
