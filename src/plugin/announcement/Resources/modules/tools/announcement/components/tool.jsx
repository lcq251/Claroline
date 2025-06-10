import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Tool} from '#/main/core/tool'

import {Announcement as AnnouncementTypes} from '#/plugin/announcement/prop-types'
import {AnnouncementEditor} from '#/plugin/announcement/tools/announcement/components/editor'
import {AnnouncementList} from '#/plugin/announcement/tools/announcement/components/list'
import {AnnouncementPost} from '#/plugin/announcement/tools/announcement/containers/post'

const AnnouncementTool = (props) =>
  <Tool
    {...props}
    editor={AnnouncementEditor}
    pages={[
      {
        path: '/',
        exact: true,
        component: AnnouncementList
      }, {
        path: '/:id',
        component: AnnouncementPost,
        exact: true,
        onEnter: (params) => props.openDetail(params.id),
        onLeave: props.resetDetail
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
