import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {route} from '#/main/community/role/routing'
import {hasPermission} from '#/main/app/security'
import {Alert} from '#/main/app/components/alert'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {PageSection} from '#/main/app/page/components/section'
import {PageTabbedSection} from '#/main/app/page/components/tabbed-section'
import {DetailsData} from '#/main/app/content/details'

import {MODAL_USERS} from '#/main/community/modals/users'
import {UserList} from '#/main/community/user/components/list'
import {MODAL_GROUPS} from '#/main/community/modals/groups'
import {GroupList} from '#/main/community/group/components/list'

import {constants} from '#/main/community/constants'
import {Role as RoleTypes} from '#/main/community/role/prop-types'
import {RolePage} from '#/main/community/role/components/page'
import {selectors} from '#/main/community/tools/community/role/store/selectors'
import {RoleRights} from '#/main/community/tools/community/role/components/rights'

const RoleShow = (props) =>
  <RolePage
    path={props.path}
    role={props.role}
    reload={(role) => props.reload(role, props.contextData)}
  >
    <PageSection className="mb-5">
      <DetailsData
        data={props.role}
        definition={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'name',
                type: 'string',
                label: trans('code')
              }, {
                name: 'type',
                type: 'choice',
                label: trans('type'),
                displayed: (role) => 'desktop' === props.contextType || constants.ROLE_PLATFORM === role.type,
                options: {
                  choices: constants.ROLE_TYPES
                },
                linked: [
                  {
                    name: 'workspace',
                    type: 'workspace',
                    label: trans('workspace'),
                    displayed: (role) => constants.ROLE_WORKSPACE === role.type
                  }, {
                    name: 'user',
                    type: 'user',
                    label: trans('user'),
                    displayed: (role) => constants.ROLE_USER === role.type
                  }
                ]
              }
            ]
          }
        ]}
      />
    </PageSection>

    {'ROLE_ANONYMOUS' !== props.role.name &&
      <PageTabbedSection
        className="embedded-list-section"
        tabs={[
          {
            name: 'permissions',
            title: trans('permissions'),
            render: () => (
              <>
                {'ROLE_ADMIN' === props.role.name &&
                  <Alert className="mt-4 mb-5" type="warning" title={trans('Les utilisateurs possédant le rôle administrateur ne sont pas soumis à la gestion de droits.')}>
                    {trans('Ils peuvent tout voir et tout faire sans restrictions. Vous ne devriez donner ce rôle qu\'à un nombre limité de personnes.')}
                  </Alert>
                }

                {'ROLE_ADMIN' !== props.role.name &&props.role.id && ('workspace' === props.contextType || constants.ROLE_WORKSPACE === props.role.type) &&
                  <RoleRights
                    role={props.role}
                    contextType={props.contextType}
                    contextId={props.contextData ? props.contextData.id : get(props.role, 'workspace.id')}
                    rights={props.workspaceRights}
                    reload={props.loadWorkspaceRights}
                  />
                }

                {'ROLE_ADMIN' !== props.role.name && props.role.id && ('desktop' === props.contextType && constants.ROLE_WORKSPACE !== props.role.type) &&
                  <RoleRights
                    role={props.role}
                    contextType={props.contextType}
                    rights={props.desktopRights}
                    reload={props.loadDesktopRights}
                  />
                }
              </>
            )
          }, {
            name: 'users',
            title: trans('users', {}, 'community'),
            render: () => (
              <>
                {hasPermission('edit', props.role) && ('workspace' !== props.contextType || constants.ROLE_PLATFORM !== props.role.type) &&
                  <Button
                    className="btn btn-primary mt-4 me-auto"
                    {...{
                      name: 'add-users',
                      type: MODAL_BUTTON,
                      // icon: 'fa fa-fw fa-plus',
                      label: trans('add_users', {}, 'actions'),
                      displayed: hasPermission('edit', props.role) && ('workspace' !== props.contextType || constants.ROLE_PLATFORM !== props.role.type),
                      modal: [MODAL_USERS, {
                        selectAction: (selected) => ({
                          type: CALLBACK_BUTTON,
                          label: trans('add', {}, 'actions'),
                          callback: () => props.addUsers(props.role.id, selected)
                        })
                      }]
                    }}
                  />
                }

                <UserList
                  className="mt-4 mb-5"
                  path={props.path}
                  name={`${selectors.FORM_NAME}.users`}
                  url={['apiv2_role_list_users', {id: props.role.id}]}
                  autoload={!!props.role.id}
                  delete={{
                    url: ['apiv2_role_remove_users', {id: props.role.id}],
                    icon: 'fa fa-fw fa-times',
                    label: trans('remove', {}, 'actions'),
                    displayed: () => (hasPermission('edit', props.role) && ('workspace' !== props.contextType || constants.ROLE_PLATFORM !== props.role.type))
                  }}
                  actions={undefined}
                />
              </>
            )
          }, {
            name: 'groups',
            title: trans('groups', {}, 'community'),
            render: () => (
              <>
                {hasPermission('edit', props.role) && ('workspace' !== props.contextType || constants.ROLE_PLATFORM !== props.role.type) &&
                  <Button
                    className=" btn btn-primary mt-4 me-auto"
                    {...{
                      name: 'add-groups',
                      type: MODAL_BUTTON,
                      // icon: 'fa fa-fw fa-plus',
                      label: trans('add_groups', {}, 'actions'),
                      displayed: hasPermission('edit', props.role) && ('workspace' !== props.contextType || constants.ROLE_PLATFORM !== props.role.type),
                      modal: [MODAL_GROUPS, {
                        selectAction: (selected) => ({
                          type: CALLBACK_BUTTON,
                          label: trans('add', {}, 'actions'),
                          callback: () => props.addGroups(props.role.id, selected)
                        })
                      }]
                    }}
                  />
                }
                <GroupList
                  className="mt-4 mb-5"
                  path={props.path}
                  name={`${selectors.FORM_NAME}.groups`}
                  url={['apiv2_role_list_groups', {id: props.role.id}]}
                  autoload={!!props.role.id}
                  delete={{
                    url: ['apiv2_role_remove_groups', {id: props.role.id}],
                    icon: 'fa fa-fw fa-times',
                    label: trans('remove', {}, 'actions'),
                    displayed: () => (hasPermission('edit', props.role) && ('workspace' !== props.contextType || constants.ROLE_PLATFORM !== props.role.type))
                  }}
                  actions={undefined}
                />
              </>
            )
          }
        ]}
      />
    }
  </RolePage>

RoleShow.propTypes = {
  path: T.string.isRequired,
  role: T.shape(
    RoleTypes.propTypes
  ),
  contextType: T.string.isRequired,
  contextData: T.object,

  workspaceRights: T.object,
  desktopRights: T.object,
  administrationRights: T.object,

  reload: T.func.isRequired,
  loadWorkspaceRights: T.func.isRequired,
  loadDesktopRights: T.func.isRequired,
  addUsers: T.func.isRequired,
  addGroups: T.func.isRequired
}

export {
  RoleShow
}
