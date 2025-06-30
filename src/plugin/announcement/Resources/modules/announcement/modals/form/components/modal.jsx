import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {actions as formActions} from '#/main/app/content/form'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {Announcement} from '#/plugin/announcement/prop-types'
import isEmpty from 'lodash/isEmpty'

const FORM_NAME = 'announcementForm'
const restrictByDates = (announcement) => get(announcement, 'restrictions._enableDates') || (get(announcement, 'restrictions.dates') && 0 !== get(announcement, 'restrictions.dates').length)
const restrictByRoles = (announcement) => get(announcement, 'restrictions._enableRoles') || (get(announcement, 'roles') && 0 !== get(announcement, 'roles').length)

const AnnouncementFormModal = (props) => {
  const dispatch = useDispatch()

  return (
    <FormModal
      {...omit(props, 'announcement')}
      name={FORM_NAME}
      title={trans(props.isNew ? 'new_announcement' : 'announcement', {}, 'announcement')}
      subtitle={props.isNew ? trans('new_announcement_desc', {}, 'announcement') : undefined}
      target={props.isNew ?
        ['claro_announcement_create'] :
        ['claro_announcement_update', {id: props.announcement.id}]
      }
      data={props.announcement}
      saveLabel={trans(props.isNew ? 'add_announcement' : 'save_announcement', {}, 'actions')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'poster',
              label: trans('poster'),
              type: 'poster',
              hideLabel: true
            }, {
              name: 'title',
              type: 'string',
              label: trans('title')
            }, {
              name: 'content',
              type: 'html',
              label: trans('content'),
              required: true,
              options: {
                workspace: props.workspace
              }
            }, {
              name: 'tags',
              type: 'tag',
              label: trans('tags')
            }, {
              name: 'restrictions._enableDates',
              label: trans('restrict_by_dates'),
              help: trans('restrict_by_dates_help'),
              type: 'boolean',
              calculated: restrictByDates,
              onChange: activated => {
                if (!activated) {
                  dispatch(formActions.updateProp('restrictions.dates', []))
                }
              },
              linked: [
                {
                  name: 'restrictions.dates',
                  type: 'date-range',
                  label: trans('access_dates'),
                  displayed: restrictByDates,
                  required: true,
                  options: {
                    time: true
                  }
                }
              ]
            }, {
              name: 'restrictions._enableRoles',
              label: trans('restrict_by_roles'),
              help: trans('restrict_by_roles_help'),
              type: 'boolean',
              displayed: false,
              calculated: restrictByRoles,
              onChange: activated => {
                if (!activated) {
                  dispatch(formActions.updateProp('roles', []))
                }
              },
              linked: [
                {
                  name: 'roles',
                  type: 'role',
                  label: trans('roles'),
                  displayed: restrictByRoles,
                  required: true,
                  options: {
                    multiple: true,
                    url: !isEmpty(get(props.announcement, 'workspace.id')) ?
                      ['apiv2_workspace_list_roles', {id: get(props.announcement, 'workspace.id')}] :
                      ['apiv2_role_list'],
                  },
                }
              ]
            }
          ]
        }
      ]}
    />
  )
}

AnnouncementFormModal.propTypes = {
  isNew: T.bool,
  announcement: T.shape(Announcement.propTypes),
  onSave: T.func
}

export {
  AnnouncementFormModal
}
