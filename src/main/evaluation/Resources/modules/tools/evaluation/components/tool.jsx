import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl'
import {Tool, selectors as toolSelectors} from '#/main/core/tool'

import {EvaluationUser} from '#/main/evaluation/tools/evaluation/containers/user'
import {EvaluationUsers} from '#/main/evaluation/tools/evaluation/containers/users'
import {EvaluationEditor} from '#/main/evaluation/tools/evaluation/editor/components/main'
import {LINK_BUTTON} from '#/main/app/buttons'
import {EvaluationOverview} from '#/main/evaluation/tools/evaluation/components/overview'
import {EvaluationActivities} from '#/main/evaluation/tools/evaluation/containers/activities'
import {EvaluationDashboard} from '#/main/evaluation/tools/evaluation/dashboard/containers/main'
import {EvaluationSequences} from '#/main/evaluation/tools/evaluation/components/sequences'
import {SequenceShow} from '#/main/evaluation/sequence/containers/show'

const EvaluationTool = (props) => {
  const canFollow = useSelector((state) => hasPermission('edit', toolSelectors.toolData(state)))

  return (
    <Tool
      {...props}
      styles={['claroline-distribution-plugin-path-path-resource']}
      menu={[
        {
          name: 'about',
          type: LINK_BUTTON,
          label: trans('my_progression'),
          target: props.path,
          exact: true
        }, {
          name: 'users',
          type: LINK_BUTTON,
          label: trans('users'),
          target: props.path+'/users',
          displayed: canFollow
        }, {
          name: 'sequences',
          type: LINK_BUTTON,
          label: trans('sequences', {}, 'evaluation'),
          target: props.path+'/sequences',
          displayed: 'workspace' === props.contextType
        }, {
          name: 'activities',
          type: LINK_BUTTON,
          label: trans('activities'),
          target: props.path+'/activities',
          //displayed: canFollow,
          displayed: 'workspace' === props.contextType
        }
      ]}
      pages={[
        {
          path: '/',
          component: EvaluationOverview,
          exact: true
        }, {
          path: '/sequences/:id',
          render: (routerProps) => <SequenceShow id={routerProps.match.params.id}  path={props.path + '/sequences'} />
        }, {
          path: '/sequences',
          component: EvaluationSequences
        }, {
          path: '/activities',
          component: EvaluationActivities,
        }, {
          path: '/users',
          component: EvaluationUsers,
          exact: true
        }, {
          path: '/users/:userId/:workspaceId?',
          onEnter: (params = {}) => props.openEvaluation(params.workspaceId || props.contextId, params.userId),
          component: EvaluationUser
        }
      ]}
      editor={EvaluationEditor}
      dashboard={EvaluationDashboard}
    />
  )
}

EvaluationTool.propTypes = {
  path: T.string.isRequired,
  contextType: T.string.isRequired,
  contextId: T.string,
  currentUserId: T.string,
  permissions: T.object,
  openEvaluation: T.func.isRequired
}

export {
  EvaluationTool
}
