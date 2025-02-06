import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {User as UserTypes} from '#/main/community/user/prop-types'
import {UserPage} from '#/main/community/user/components/page'

import {selectors} from '#/main/community/tools/community/user/store'
import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_GROUPS} from '#/main/community/modals/groups'
import {GroupList} from '#/main/community/group/components/list'

import {PageSection, PageTabbedSection} from '#/main/app/page'
import {DetailsData} from '#/main/app/content/details/containers/data'
import {Datetime} from '#/main/app/components/date'
import {route} from '#/main/community/user/routing'
import {Activity} from '#/main/log/activity/components/main'
import {getProfile} from '#/main/community/user/utils'
import {Button} from '#/main/app/action'
import {Html} from '#/main/app/components/html'

const UserShow = (props) => {
  const [profilePages, setProfilePages] = useState([])

  useEffect(() => {
    getProfile().then(profilePages => setProfilePages(profilePages))
  }, [props.path])

  return (
    <UserPage
      path={props.path}
      user={props.user}
      reload={props.reload}
    >
      <PageSection size="md">
        <div className="text-body-tertiary d-flex align-items-center gap-3 mb-4" role="presentation">
          <div className="d-inline-flex gap-1 align-items-baseline" role="presentation">
            {trans('registered_at')}
            <Datetime value={get(props.user, 'meta.created')} />
          </div>

          <span role="presentation">-</span>

          <div className="d-inline-flex gap-1 align-items-baseline" role="presentation">
            {trans('last_activity_at')}
            {get(props.user, 'lastActivity') ? <Datetime value={get(props.user, 'lastActivity')} time={true} /> : trans('never')}
          </div>
        </div>

        {get(props.user, 'meta.description') &&
          <Html className="lead mb-5">{get(props.user, 'meta.description')}</Html>
        }
      </PageSection>

      <PageSection size="md" className="bg-body-tertiary">
        <DetailsData
          className="mt-3"
          name={selectors.FORM_NAME}
          definition={[
            {
              title: trans('general'),
              primary: true,
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: trans('email'),
                  required: true,
                  options: {
                    unique: {
                      check: ['apiv2_user_get', {field: 'email'}]
                    }
                  }
                }, {
                  name: 'phone',
                  type: 'phone',
                  label: trans('phone')
                }, {
                  name: 'address',
                  type: 'address',
                  label: trans('address')
                }, {
                  name: 'code',
                  type: 'string',
                  label: trans('code')
                }
              ]
            }
          ]}
        />
      </PageSection>

      <PageTabbedSection
        size="md"
        className="mt-3"
        path={route(props.user, props.path)}
        tabs={[
          {
            path: '',
            exact: true,
            title: trans('activity'),
            render: () => (
              <Activity
                name={selectors.FORM_NAME+'.logs'}
                url={['apiv2_logs_functional_list_user', {userId: props.user.id}]}
              />
            )
          }, {
            path: '/profile',
            exact: true,
            title: trans('Profil'),
            render: () => (
              <>
              </>
            )
          }, {
            path: '/groups',
            exact: true,
            title: trans('groups', {}, 'community'),
            render: () => (
              <>
                {hasPermission('administrate', props.user) &&
                  <Button
                    className="btn btn-primary mt-4 me-auto"
                    {...{
                      name: 'add',
                      type: MODAL_BUTTON,
                      // icon: 'fa fa-fw fa-plus',
                      label: trans('add_group', {}, 'actions'),
                      displayed: hasPermission('administrate', props.user),
                      modal: [MODAL_GROUPS, {
                        selectAction: (groups) => ({
                          type: CALLBACK_BUTTON,
                          label: trans('add', {}, 'actions'),
                          callback: () => props.addGroups(props.user.id, groups.map(group => group.id))
                        })
                      }]
                    }}
                  />
                }

                <GroupList
                  className="mt-4 mb-5"
                  path={props.path}
                  name={`${selectors.FORM_NAME}.groups`}
                  url={['apiv2_user_list_groups', {id: props.user.id}]}
                  autoload={!!props.user.id}
                  delete={{
                    url: ['apiv2_user_remove_groups', {id: props.user.id}],
                    icon: 'fa fa-fw fa-times',
                    label: trans('remove', {}, 'actions'),
                    displayed: () => hasPermission('administrate', props.user)
                  }}
                  actions={undefined}
                />
              </>
            )
          }, {
            path: '/trainings',
            exact: true,
            title: trans('courses', {}, 'cursus'),
            render: () => (
              <>
              </>
            )
          }, {
            path: '/workspaces',
            title: trans('workspaces', {}, 'workspace'),
            render: () => (
              <>
              </>
            )
          }, {
            path: '/badges',
            title: trans('badges', {}, 'badge'),
            render: () => (
              <>
              </>
            )
          }
        ].concat(profilePages)}
      />
    </UserPage>
  )
}

UserShow.propTypes = {
  path: T.string.isRequired,
  user: T.shape(
    UserTypes.propTypes
  ),
  reload: T.func.isRequired,
  addRoles: T.func.isRequired,
  addOrganizations: T.func.isRequired,
  addGroups: T.func.isRequired
}

export {
  UserShow
}
