import React, {createElement, useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {PageContent, PageHeading, PageHeadingSkeleton, PageSection, PageTabbedSection} from '#/main/app/page'
import {Action as ActionTypes, PromisedAction as PromisedActionTypes} from '#/main/app/action/prop-types'
import {DetailsData} from '#/main/app/content/details'
import {getProfile} from '#/main/community/user/utils'

import {User as UserTypes} from '#/main/community/user/prop-types'
import {UserAvatar} from '#/main/app/user/components/avatar'
import {UserGroups} from '#/main/community/user/components/groups'
import {UserAbout} from '#/main/community/user/components/about'
import {UserActivity} from '#/main/community/user/components/activity'

const UserProfile = (props) => {
  const [profilePages, setProfilePages] = useState([])

  useEffect(() => {
    getProfile().then(profilePages => setProfilePages(profilePages))
  }, [props.path])

  return (
    <>
      {isEmpty(props.user) &&
        <PageContent className="placeholder-glow">
          <PageHeadingSkeleton
            size="md"
            icon={true}
            description={true}
          />
        </PageContent>
      }

      {!isEmpty(props.user) &&
        <PageContent>
          <PageHeading
            size="md"
            poster={get(props.user, 'poster')}
            icon={
              <UserAvatar user={props.user} size="lg" border={true} />
            }
            title={get(props.user, 'name')}
            description={get(props.user, 'meta.description')}
            primaryAction={props.primaryAction}
            actions={props.actions}
          />

          <PageSection size="md" className="mb-5">
            <DetailsData
              data={props.user}
              definition={[
                {
                  title: trans('general'),
                  primary: true,
                  fields: [
                    {
                      name: 'lastActivity',
                      type: 'date',
                      label: trans('last_activity'),
                      options: {time: true, long: true}
                    }, {
                      name: 'meta.created',
                      type: 'date',
                      label: trans('registration_date'),
                      options: {time: true, long: true}
                    }, {
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
            path={props.path}
            tabs={[
              {
                path: '',
                exact: true,
                title: trans('activity'),
                render: () => (
                  <UserActivity path={props.path} user={props.user} />
                )
              }, {
                path: '/profile',
                title: trans('about'),
                render: () => (
                  <UserAbout path={props.path} user={props.user} />
                )
              }, {
                path: '/groups',
                title: trans('groups', {}, 'community'),
                render: () => (
                  <UserGroups path={props.path} user={props.user} addGroups={props.addGroups} />
                )
              }
            ].concat(profilePages.map(profilePage => ({
              ...omit(profilePage, 'name', 'component'),
              path: '/' + profilePage.name,
              render: () => {
                return createElement(profilePage.component, {
                  path: props.path,
                  user: props.user
                })
              }
            })))}
          />
        </PageContent>
      }
    </>
  )
}

UserProfile.propTypes = {
  path: T.string.isRequired,
  user: T.shape(
    UserTypes.propTypes
  ),
  primaryAction: T.string,
  actions: T.oneOfType([
    // a regular array of actions
    T.arrayOf(T.shape(
      ActionTypes.propTypes
    )),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedActionTypes.propTypes
    )
  ]),
  addGroups: T.func.isRequired
}

export {
  UserProfile
}
