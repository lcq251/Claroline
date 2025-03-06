import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON} from '#/main/app/buttons'

import {supportEvaluation} from '#/main/core/resource/utils'
import {selectors} from '#/main/core/resource/store'
import {DashboardActions} from '#/main/app/dashboard/components/actions'

const ResourceDashboardActions = (props) => {
  const resource = useSelector(selectors.resourceNode)

  return (
    <DashboardActions
      actions={[
        {
          title: trans('recompute_evaluations', {}, 'actions'),
          help: trans('recompute_resource_evaluations_help', {}, 'actions'),
          displayed: supportEvaluation(resource),
          action: {
            label: trans('recalculate', {}, 'actions'),
            type: ASYNC_BUTTON,
            request: {
              url: ['apiv2_resource_evaluation_recompute', {resourceId: resource.id}],
              request: {
                method: 'PUT'
              }
            }
          }
        },
      ].concat(props.actions || [])}
    />
  )
}

ResourceDashboardActions.propTypes = {
  actions: T.arrayOf(T.shape({
    title: T.string.isRequired,
    help: T.string.isRequired,
    displayed: T.bool,
    action: T.object.isRequired,
    dangerous: T.bool
  }))
}

export {
  ResourceDashboardActions
}
