import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useHistory} from 'react-router-dom'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {PageSection} from '#/main/app/page'
import {UserMicro} from '#/main/core/user/components/micro'
import {Datetime} from '#/main/app/components/date'

import {Announcement as AnnouncementTypes} from '#/plugin/announcement/prop-types'
import {MODAL_ANNOUNCEMENT_SENDING} from '#/plugin/announcement/tools/announcement/modals/sending'
import {PageHeading} from '#/main/app/page/components/heading'
import {Content} from '#/main/app/components/content'
import {ToolPage} from '#/main/core/tool'
import {ContentLoader} from '#/main/app/content/components/loader'

const AnnouncementPost = (props) => {
  const history = useHistory()

  if (!props.announcement) {
    return (
      <ContentLoader size="lg" />
    )
  }

  return (
    <ToolPage
      poster={props.announcement.poster}
      title={props.announcement.title}
      breadcrumb={[
        {
          label: props.announcement.title,
          target: props.path+'/'+props.announcement.id
        }
      ]}
    >
      <PageHeading
        size="md"
        title={props.announcement.title}
        actions={[
          {
            name: 'download',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-file-pdf',
            label: trans('export-pdf',{}, 'actions'),
            callback: () => props.exportPDF(props.announcement)
          }, {
            name: 'send',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-paper-plane',
            label: trans('send', {}, 'actions'),
            target: `${props.path}/${props.announcement.id}/send`,
            modal: [MODAL_ANNOUNCEMENT_SENDING, {
              announcement: props.announcement,
              workspaceRoles: props.workspaceRoles
            }],
            displayed: props.editable
          }, {
            name: 'edit',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            target: `${props.path}/${props.announcement.id}/edit`,
            displayed: props.editable
          }, {
            name: 'delete',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-trash',
            label: trans('delete', {}, 'actions'),
            callback: () => {
              props.remove(props.announcement)
              history.push(props.path)
            },
            dangerous: true,
            confirm: {
              title: trans('announcement_delete_confirm_title', {}, 'announcement'),
              message: trans('announcement_delete_confirm_message', {}, 'announcement'),
            },
            displayed: props.editable
          }
        ]}
      />

      <PageSection size="md" className="mb-5">
        <Content
          placeholder={trans('no_content')}
          meta={
            <>
              <UserMicro
                {...get(props.announcement, 'meta.creator', {})}
                noStatus={true}
                link={true}
              />

              <span>-</span>

              {get(props.announcement, 'meta.publishedAt') &&
                <Datetime value={get(props.announcement, 'meta.publishedAt')} long={true} />
              }
            </>
          }
          tags={props.announcement.tags}
        >
          {props.announcement.content}
        </Content>
      </PageSection>
    </ToolPage>
  )
}

AnnouncementPost.propTypes = {
  path: T.string.isRequired,
  editable: T.bool,
  announcement: T.shape(
    AnnouncementTypes.propTypes
  ).isRequired,
  workspaceRoles: T.array,
  exportPDF: T.func.isRequired,
  remove: T.func.isRequired
}

export {
  AnnouncementPost
}
