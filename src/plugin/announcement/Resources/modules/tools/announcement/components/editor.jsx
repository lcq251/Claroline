import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ToolEditor, ToolEditorAppearance} from '#/main/core/tool/editor'

import {selectors} from '#/plugin/announcement/tools/announcement/store'

const AnnouncementEditorAppearance = () =>
  <ToolEditorAppearance
    definition={[{
      title: trans('Templates'),
      subtitle: trans('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer condimentum scelerisque lorem, non finibus ligula pretium et.'),
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
    }]}
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
