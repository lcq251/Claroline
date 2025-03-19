import {trans} from '#/main/app/intl/translation'

const FILE_TYPES = {
  'audio/*': trans('audio', {}, 'clacoform'),
  'image/*': trans('image', {}, 'clacoform'),
  'video/*': trans('video', {}, 'clacoform'),
  'application/pdf': 'PDF'
}

const ENTRY_STATUS_PENDING = 0
const ENTRY_STATUS_PUBLISHED = 1
const ENTRY_STATUS_UNPUBLISHED = 2

const CHOICE_MENU = 'menu'
const CHOICE_RANDOM = 'random'
const CHOICE_SEARCH = 'search'
const CHOICE_ADD = 'add'

const CHOICE_ALL = 'all'
const CHOICE_NONE = 'none'

const CHOICE_MANAGER = 'manager'

const DEFAULT_HOME_CHOICES = {
  [CHOICE_MENU]: trans('home', {}, 'clacoform'),
  [CHOICE_RANDOM]: trans('random_mode', {}, 'clacoform'),
  [CHOICE_SEARCH]: trans('search_mode', {}, 'clacoform'),
  [CHOICE_ADD]: trans('entry_addition', {}, 'clacoform')
}

const DISPLAY_METADATA_CHOICES = {
  [CHOICE_ALL]: trans('yes'),
  [CHOICE_NONE]: trans('no'),
  [CHOICE_MANAGER]: trans('choice_manager_only', {}, 'clacoform')
}

export const constants = {
  FILE_TYPES,
  ENTRY_STATUS_PENDING,
  ENTRY_STATUS_PUBLISHED,
  ENTRY_STATUS_UNPUBLISHED,
  DEFAULT_HOME_CHOICES,
  DISPLAY_METADATA_CHOICES
}
