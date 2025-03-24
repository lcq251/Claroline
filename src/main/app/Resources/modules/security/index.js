
import {isAdmin, hasPermission, hasRole} from '#/main/app/security/permissions'
import {useCurrentUser} from '#/main/app/security/hooks/useCurrentUser'
import {MODAL_SECURITY} from '#/main/app/security/modals/security'
import {selectors} from '#/main/app/security/store/selectors'

export {
  isAdmin,
  hasPermission,
  hasRole,
  useCurrentUser,
  MODAL_SECURITY,
  selectors
}
