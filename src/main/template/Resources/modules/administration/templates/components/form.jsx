import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'

import {selectors} from '#/main/template/administration/templates/store'
import {constants} from '#/main/template/administration/templates/constants'
import {Template as TemplateTypes} from '#/main/template/data/types/template/prop-types'
import {useSelector} from 'react-redux'

const TemplateForm = (props) => {
  const templateType = useSelector(selectors.templateType)

  console.log(templateType)

  return (
    <FormData
      level={2}
      name={selectors.STORE_NAME + '.template'}
      buttons={true}
      cancel={{
        type: LINK_BUTTON,
        target: props.path + `/${templateType.name}`,
        exact: true
      }}
      save={{
        type: CALLBACK_BUTTON,
        callback: () => props.saveForm(templateType.name, props.template.id, props.new)
      }}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'name',
              type: 'string',
              label: trans('name'),
              required: true,
              disabled: (template) => template.system
            }, {
              name: 'description',
              type: 'string',
              label: trans('description'),
              recommended: true,
              options: {long: true},
              disabled: (template) => template.system
            }, {
              name: 'default',
              type: 'boolean',
              label: trans('define_as_default_for_type', {}, 'template')
            }
          ]
        }
      ].concat(props.locales.map(locale => ({
        title: trans(locale),
        defaultOpened: locale === props.defaultLocale,
        opened: locale === props.defaultLocale,
        fields: [
          {
            name: `contents.${locale}.title`,
            type: 'string',
            label: trans('title'),
            disabled: (template) => template.system
          }, {
            name: `contents.${locale}.content`,
            type: 'string',
            label: trans('content'),
            disabled: (template) => template.system,
            options: {
              long: true
            }
          }
        ]
      })))}
    >
      <FormSections level={3}>
        <FormSection
          icon="fa fa-fw fa-exchange-alt"
          title={trans('parameters')}
        >
          <div className="alert alert-info">
            {trans('placeholders_info', {}, 'template')}
          </div>

          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>{trans('parameter')}</th>
                <th>{trans('description')}</th>
              </tr>
            </thead>
            <tbody>
            {constants.DEFAULT_PLACEHOLDERS.map((placeholder, idx) =>
              <tr key={`default-placeholder-${idx}`}>
                <td>{`%${placeholder}%`}</td>
                <td>{trans(`${placeholder}_desc`, {}, 'template')}</td>
              </tr>
            )}
            {templateType && templateType.placeholders && templateType.placeholders.map((placeholder, idx) =>
              <tr key={`custom-placeholder-${idx}`}>
                <td>{`%${placeholder}%`}</td>
                <td>{trans(`${placeholder}_desc`, {}, 'template')}</td>
              </tr>
            )}
            </tbody>
          </table>
        </FormSection>
      </FormSections>
    </FormData>
  )
}

TemplateForm.propTypes = {
  path: T.string.isRequired,
  new: T.bool.isRequired,
  template: T.shape(
    TemplateTypes.propTypes
  ).isRequired,
  defaultLocale: T.string,
  locales: T.arrayOf(T.string),
  saveForm: T.func.isRequired
}

export {
  TemplateForm
}
