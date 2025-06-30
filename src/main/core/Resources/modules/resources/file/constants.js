import {trans} from '#/main/app/intl/translation'

// propose to download the raw file when opening the resource
const OPENING_DOWNLOAD = 'download'
// try to use the browser player to display the file
const OPENING_BROWSER = 'browser'

const OPENING_TYPES = {
  [OPENING_DOWNLOAD]: trans('file_opening_download'),
  [OPENING_BROWSER]: trans('file_opening_browser')
}

export const constants = {
  OPENING_TYPES,
  OPENING_DOWNLOAD,
  OPENING_BROWSER
}
