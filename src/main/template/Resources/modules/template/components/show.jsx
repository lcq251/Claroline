import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {selectors} from '#/main/template/administration/templates/store'
import {Tab, Tabs} from '#/main/app/components/tabs'
import {CountryFlag} from '#/main/app/components/country-flag'
import {Form} from '#/main/app/content/form'
import {FormFieldset} from '#/main/app/content/form/containers/fieldset'

import {Template} from '#/main/template/prop-types'
import {Alert} from '#/main/app/components/alert'
import {Toolbar} from '#/main/app/action'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_TEMPLATE_FORM} from '#/main/template/template/modals/form'

const TemplateShow = (props) => {
  const currentLocale = useSelector(selectors.currentLocale)
  const locales = useSelector(selectors.locales)

  return (
    <>
      <Toolbar
        className="d-flex gap-1 mb-4 ms-auto"
        dangerousName="btn btn-body"
        primaryName="btn btn-primary"
        disabled={get(props.template, 'system', false)}
        actions={[
          {
            name: 'edit',
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            type: MODAL_BUTTON,
            modal: [MODAL_TEMPLATE_FORM, {
              template: props.template,
              onSave: (updatedTemplate) => props.update(updatedTemplate)
            }],
            primary: true
          }, {
            name: 'delete',
            label: trans('delete', {}, 'actions'),
            type: CALLBACK_BUTTON,
            callback: () => props.delete(props.template),
            confirm: trans('template_delete_confirm_message', {}, 'template'),
            dangerous: true
          }
        ]}
      />
      <Form
        className="flex-fill"
        level={2}
        name={selectors.STORE_NAME + '.template'}
        buttons={true}
        target={(template, isNew) => isNew ?
          ['apiv2_template_create'] :
          ['apiv2_template_update', {id: template.id}]
        }
        disabled={get(props.template, 'system', false)}
      >
        <Tabs
          className="mb-n4"
          defaultActiveKey={currentLocale}
        >
          {locales.map(locale =>
            <Tab
              key={locale}
              eventKey={locale}
              title={
                <>
                  <CountryFlag countryCode={'en' === locale ? 'gb' : locale} className="me-2" />
                  {trans(locale)}
                </>
              }
            >
              <div className="data-form-section">
                <FormFieldset
                  name={selectors.STORE_NAME + '.template'}
                  disabled={get(props.template, 'system', false)}
                  fields={[
                    {
                      name: `contents.${locale}.title`,
                      type: 'string',
                      label: trans('title'),
                      recommended: true
                    }, {
                      name: `contents.${locale}.content`,
                      type: 'html',
                      label: trans('content'),
                      required: true,
                      options: {
                        config: {
                          plugins: ['placeholders'],
                          placeholders: props.placeholders
                        }
                      }
                    }
                  ]}
                />
              </div>
            </Tab>
          )}

          <Tab
            eventKey="parameters"
            title={
              <>
                <span className="fa fa-fw fa-info-circle" aria-hidden={true}/>
              </>
            }
          >
            <Alert type="info">
              {trans('placeholders_info', {}, 'template')}
            </Alert>

            <table className="table table-striped table-hover mb-5">
              <thead>
                <tr>
                  <th>{trans('parameter')}</th>
                  <th>{trans('description')}</th>
                </tr>
              </thead>
              <tbody>
                {props.placeholders && props.placeholders.map((placeholder, idx) =>
                  <tr key={`custom-placeholder-${idx}`}>
                    <td>{`%${placeholder}%`}</td>
                    <td>{trans(`${placeholder}_desc`, {}, 'template')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Tab>
        </Tabs>
      </Form>
    </>
  )
}

TemplateShow.propTypes = {
  template: T.shape(
    Template.propTypes
  ),
  placeholders: T.array,
  update: T.func.isRequired,
  delete: T.func.isRequired
}

export {
  TemplateShow
}
