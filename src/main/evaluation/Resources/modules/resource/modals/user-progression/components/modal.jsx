import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {route} from '#/main/core/resource'

import {UserProgressionModal as BaseProgressionModal} from '#/main/evaluation/modals/user-progression/containers/modal'
import {getActions} from '#/main/evaluation/resource/utils'
import {ResourceEvaluation} from '#/main/evaluation/resource/prop-types'

const UserProgressionModal = props => {
  const currentUser = useSelector(securitySelectors.currentUser)

  return (
    <BaseProgressionModal
      {...omit(props, 'evaluation', 'path', 'stepsProgression', 'fetchUserStepsProgression', 'resetUserStepsProgression')}
      evaluation={props.evaluation}
      url={['apiv2_resource_evaluation_get', {resource: get(props.evaluation, 'resource.id'), user: get(props.evaluation, 'user.id')}]}
      actions={getActions([props.evaluation], {}, route(get(props.evaluation, 'resourceNode')), currentUser)}
      additional={[
        {
          icon: 'fa fa-rotate-right',
          label: trans('attempts', {}, 'evaluation'),
          value: get(props.evaluation, 'nbAttempts', 0)
        }
      ]}
    />
  )
}

UserProgressionModal.propTypes = {
  evaluation: T.shape(
    ResourceEvaluation.propTypes
  ).isRequired,
  fadeModal: T.func.isRequired
}

export {
  UserProgressionModal
}
