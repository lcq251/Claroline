import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Tool, constants as toolConstants} from '#/main/core/tool'

import {CommunityDashboard} from '#/main/community/tools/community/dashboard/components/main'
import {UserMain} from '#/main/community/tools/community/user/containers/main'
import {GroupMain} from '#/main/community/tools/community/group/containers/main'
import {RoleMain} from '#/main/community/tools/community/role/containers/main'
import {PendingMain} from '#/main/community/tools/community/pending/containers/main'
import {TeamMain} from '#/main/community/tools/community/team/containers/main'

import {CommunityEditor} from '#/main/community/tools/community/editor/components/main'

const CommunityTool = (props) =>
  <Tool
    {...props}
    redirect={[
      {from: '/', exact: true, to: '/users', disabled: props.contextType === toolConstants.TOOL_WORKSPACE && get(props.contextData, 'meta.model')},
      {from: '/', exact: true, to: '/roles', disabled: props.contextType !== toolConstants.TOOL_WORKSPACE || !get(props.contextData, 'meta.model')}
    ]}
    menu={[
      {
        name: 'users',
        type: LINK_BUTTON,
        label: trans('users', {}, 'community'),
        target: `${props.path}/users`,
        displayed: props.contextType !== toolConstants.TOOL_WORKSPACE || !get(props.contextData, 'meta.model')
      }, {
        name: 'groups',
        type: LINK_BUTTON,
        label: trans('groups', {}, 'community'),
        target: `${props.path}/groups`,
        displayed: props.contextType !== toolConstants.TOOL_WORKSPACE || !get(props.contextData, 'meta.model')
      }, {
        name: 'pending',
        type: LINK_BUTTON,
        label: trans('pending_registrations'),
        target: `${props.path}/pending`,
        displayed: props.contextType === toolConstants.TOOL_WORKSPACE && props.canRegister && props.hasPendingRegistrations
      }, {
        name: 'teams',
        type: LINK_BUTTON,
        label: trans('teams', {}, 'community'),
        target: `${props.path}/teams`,
        displayed: props.contextType === toolConstants.TOOL_WORKSPACE
      }, {
        name: 'roles',
        type: LINK_BUTTON,
        label: trans('roles', {}, 'community'),
        target: `${props.path}/roles`,
        displayed: props.canEdit
      }
    ]}
    pages={[
      {
        path: '/users',
        component: UserMain,
        disabled: props.contextType === toolConstants.TOOL_WORKSPACE && get(props.contextData, 'meta.model')
      }, {
        path: '/groups',
        component: GroupMain,
        disabled:  props.contextType === toolConstants.TOOL_WORKSPACE && get(props.contextData, 'meta.model')
      }, {
        path: '/roles',
        component: RoleMain,
        disabled: !props.canEdit
      }, {
        path: '/teams',
        component: TeamMain,
        disabled: props.contextType === toolConstants.TOOL_DESKTOP
      }, {
        path: '/pending',
        component: PendingMain,
        disabled: !props.canRegister || props.contextType !== toolConstants.TOOL_WORKSPACE || !props.hasPendingRegistrations
      }
    ]}
    actions={[

    ]}
    editor={CommunityEditor}
    dashboard={CommunityDashboard}
  />

CommunityTool.propTypes = {
  path: T.string.isRequired,
  contextType: T.string,
  contextData: T.object,
  workspace: T.object,
  hasPendingRegistrations: T.bool.isRequired,
  canRegister: T.bool.isRequired,
  canEdit: T.bool.isRequired
}

export {
  CommunityTool
}
