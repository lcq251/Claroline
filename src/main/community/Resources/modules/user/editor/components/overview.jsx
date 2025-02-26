import React from 'react'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as configSelectors} from '#/main/app/config/store'
import {formatSections} from '#/main/app/content/form/parameters/utils'

import {selectors} from '#/main/community/user/editor/store'

const UserEditorOverview = () => {
  const authenticatedUserId = useSelector(securitySelectors.currentUserId)
  const currentUser = useSelector(selectors.user)
  const isOwner = authenticatedUserId === currentUser.id

  const userProfile = useSelector((state) => configSelectors.param(state, 'userProfile'))
  const hasUsername = useSelector((state) => configSelectors.param(state, 'community.username'))

  let profileSections = []
  if (!isEmpty(userProfile) && !isEmpty(userProfile.sections)) {
    let allFields = []
    userProfile.sections.map(section => {
      allFields = allFields.concat(section.fields)
    })

    // TODO : add roles checks
    profileSections = formatSections(userProfile.sections, allFields, 'profile', isOwner, true, true)
  }

  return (
    <EditorPage
      title={trans('overview')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'poster',
              type: 'poster',
              label: trans('poster'),
              hideLabel: true
            }, {
              name: 'username',
              type: 'string',
              label: trans('username'),
              required: true,
              displayed: hasUsername,
              options: {
                unique: {
                  check: ['apiv2_user_get', {field: 'username'}],
                  error: 'This username already exists.'
                }
              }
            }, {
              name: 'meta.description',
              type: 'string',
              label: trans('À propos de moi'),
              options: {
                long: true,
                minRows: 2
              }
            }, {
              name: 'public',
              type: 'boolean',
              label: trans('Rendre mon profil public'),
              help: [
                trans('Lorsque votre profil est privé, seuls les gestionnaires peuvent consulter les informations.', {}, 'community'),
                trans('Lorsque votre profil est public, tous les membres de la plateforme peuvent le consulter (à l\'esception des informations marquées "confidentielles").', {}, 'community'),
                trans('Tous les membres de la plateforme peuvent voir certaines informations, comme votre nom d\'utilisateur et votre photo de profil.')
              ]
            }
          ]
        }, {
          title: trans('Informations personnelles'),
          description: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet tristique diam, sit amet auctor erat.'),
          primary: true,
          fields: [
            {
              name: 'firstName',
              type: 'string',
              label: trans('first_name'),
              required: true
            }, {
              name: 'lastName',
              type: 'string',
              label: trans('last_name'),
              required: true
            }, {
              name: 'phone',
              type: 'phone',
              label: trans('phone')
            }
          ]
        }
      ].concat(profileSections.map(section => Object.assign({}, section, {
        primary: true
      })))}
    />
  )
}

export {
  UserEditorOverview
}
