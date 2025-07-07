import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ToolEditor, ToolEditorAppearance} from '#/main/core/tool/editor'

import {selectors} from '#/plugin/announcement/tools/announcement/store'

const AnnouncementEditorAppearance = () =>
  <ToolEditorAppearance
    definition={[
      {
        title: trans('announcement_list', {}, 'announcement'),
        primary: true,
        fields: [{
          name: 'parameters.listFullContent',
          type: 'boolean',
          label: trans('list_full_content', {}, 'announcement'),
          help: trans('list_full_content_help', {}, 'announcement')
        }]
      }, {
        title: trans('Templates'),
        primary: true,
        fields: [{
          name: 'parameters.templateEmail',
          label: trans('email_announcement', {}, 'template'),
          type: 'template',
          options: {
            templateType: 'email_announcement'
          }
        }, {
          name: 'parameters.templatePdf',
          label: trans('pdf_announcement', {}, 'template'),
          type: 'template',
          options: {
            templateType: 'pdf_announcement'
          }
        }]
      }
    ]}
  />

const AnnouncementEditor = () => {
  const parameters = useSelector(selectors.parameters)

  return (
    <ToolEditor
      additionalData={() => ({
        parameters: parameters
      })}
      appearancePage={AnnouncementEditorAppearance}
    />
  )
}

export {
  AnnouncementEditor
}
