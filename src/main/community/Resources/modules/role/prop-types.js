import {PropTypes as T} from 'prop-types'

import {constants} from '#/main/community/constants'

const Role = {
  propTypes: {
    id: T.string,
    name: T.string,
    translationKey: T.string,
    type: T.string.isRequired,
    meta: T.shape({
      readOnly: T.bool
    }),
    permissions: T.shape({
      open: T.bool,
      edit: T.bool,
      administrate: T.bool,
      delete: T.bool
    })
  },
  defaultProps: {
    type: constants.ROLE_PLATFORM
  }
}

export {
  Role
}
