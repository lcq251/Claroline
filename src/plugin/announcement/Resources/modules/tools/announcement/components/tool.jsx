import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {makeId} from '#/main/app/utils/id'
import {Tool} from '#/main/core/tool'

import {Announcement as AnnouncementTypes} from '#/plugin/announcement/prop-types'
import {AnnouncementEditor} from '#/plugin/announcement/tools/announcement/components/editor'
import {AnnouncementList} from '#/plugin/announcement/tools/announcement/components/list'
import {AnnounceForm} from '#/plugin/announcement/tools/announcement/components/announce-form'
import {AnnouncementPost} from '#/plugin/announcement/tools/announcement/containers/post'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

const AnnouncementTool = (props) =>
  <Tool
    {...props}
    styles={['claroline-distribution-plugin-announcement-announcement-tool']}
    editor={AnnouncementEditor}
    menu={[
      {
        name: 'announcements',
        type: LINK_BUTTON,
        label: trans('announcements', {}, 'announcement'),
        target: props.path
      }
    ]}
    pages={[
      {
        path: '/',
        exact: true,
        component: AnnouncementList
      }, {
        path: '/add',
        component: AnnounceForm,
        onEnter: () => props.resetForm(merge({}, AnnouncementTypes.defaultProps, {
          id: makeId()
        }), true)
      }, {
        path: '/:id',
        component: AnnouncementPost,
        exact: true,
        onEnter: (params) => props.openDetail(params.id),
        onLeave: props.resetDetail
      }, {
        path: '/:id/edit',
        component: AnnounceForm,
        onEnter: (params) => props.resetForm(props.posts.find(post => post.id === params.id))
      }
    ]}
  />

AnnouncementTool.propTypes = {
  path: T.string.isRequired,
  posts: T.arrayOf(
    T.shape(AnnouncementTypes.propTypes)
  ).isRequired,
  openDetail: T.func.isRequired,
  resetDetail: T.func.isRequired,
  resetForm: T.func.isRequired
}

export {
  AnnouncementTool
}
