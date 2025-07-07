import React, {useEffect} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Editor} from '#/main/app/editor/components/main'
import {selectors} from '#/main/transfer/tools/import/store'
import {ImportEditorFormat} from '#/main/transfer/import/editor/components/format'
import {ImportEditorPlaning} from '#/main/transfer/import/editor/components/planing'
import {ImportEditorOverview} from '#/main/transfer/import/editor/components/overview'
import {ImportEditorExamples} from '#/main/transfer/import/editor/components/examples'

const ImportEditor = (props) => {
  let entity = get(props.formData, 'action') ? props.formData.action.substring(0, props.formData.action.indexOf('_')) : props.formData.type
  let action = get(props.formData, 'action') ? props.formData.action.substring(props.formData.action.indexOf('_') + 1) : props.formData.action

  useEffect(() => {
    if (props.isNew) {
      props.resetForm(props.contextData)
    }
  }, [props.isNew])

  return (
    <Editor
      path={props.path + (props.isNew ? '/new' : '/edit')}
      styles={['claroline-distribution-main-transfer-transfer-tool']}
      title={get(props.formData, 'name') || trans('import', {}, 'transfer')}
      name={selectors.FORM_NAME}
      target={(formData, isNew) => isNew ? ['apiv2_transfer_import_create']: ['apiv2_transfer_import_update', {id: props.formData.id}]}
      onSave={(response) => {
        props.history.push(props.path + '/' + response.id + '/edit')
        return props.onSave(response)
      }}
      close={props.path}
      defaultPage="overview"
      overviewPage={ImportEditorOverview}
      pages={[
        {
          name:'format',
          title: trans('format'),
          displayed: false,
          render: () => (
            <ImportEditorFormat
              schema={get(props.explanation, entity+'.'+action, {})}
            />
          )
        }, {
          name:'examples',
          title: trans('examples', {}, 'transfer'),
          disabled: get(props.samples, entity+'.'+action, []).length <= 0,
          render: () => (
            <ImportEditorExamples
              samples={get(props.samples, entity+'.'+action, [])}
              format={props.formData.format}
              entity={entity}
              action={action}
            />
          )
        }, {
          name:'planing',
          title: trans('planing', {}, 'scheduler'),
          disabled: props.schedulerEnabled === false,
          render: () => (
            <ImportEditorPlaning
              schedulerEnabled={props.schedulerEnabled}
              updateProp={props.updateProp}
              isNew={props.isNew}
            />
          )
        }
      ].concat(props.pages || [])}
    />
  )
}

ImportEditor.propTypes = {
  path: T.string.isRequired,
  formData: T.shape({
    id: T.string,
    name: T.string,
    action: T.string,
    format: T.string,
    type: T.string
  }),
  pages: T.array,
  history: T.object,
  contextData: T.object,
  isNew: T.bool.isRequired,
  onSave: T.func.isRequired,
  resetForm: T.func.isRequired,
  samples: T.object.isRequired,
  updateProp: T.func.isRequired,
  explanation: T.object.isRequired,
  schedulerEnabled: T.bool.isRequired
}

export {
  ImportEditor
}
