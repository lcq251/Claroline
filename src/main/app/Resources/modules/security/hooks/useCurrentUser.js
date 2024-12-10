import {useSelector} from 'react-redux'

import {selectors as securitySelectors} from '#/main/app/security/store/selectors'

function useCurrentUser() {
  return useSelector(securitySelectors.currentUser)
}

export {
  useCurrentUser
}
