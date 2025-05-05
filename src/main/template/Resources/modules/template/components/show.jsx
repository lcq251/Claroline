import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {selectors} from '#/main/template/administration/templates/store'
import {Tab, Tabs} from '#/main/app/components/tabs'
import {CountryFlag} from '#/main/app/components/country-flag'
import {Form} from '#/main/app/content/form'
import {FormFieldset} from '#/main/app/content/form/containers/fieldset'

import {Template} from '#/main/template/prop-types'

const TemplateShow = (props) => {
  const currentLocale = useSelector(selectors.currentLocale)
  const locales = useSelector(selectors.locales)

  return (
    <Form
      className="flex-fill"
      level={2}
      name={selectors.STORE_NAME + '.template'}
      buttons={true}
      target={(template, isNew) => isNew ?
        ['apiv2_template_create'] :
        ['apiv2_template_update', {id: template.id}]
      }
    >
      <Tabs
        defaultActiveKey={currentLocale}
      >
        {locales.map(locale =>
          <Tab
            className="coucou"
            key={locale}
            eventKey={locale}
            title={
              <>
                <CountryFlag countryCode={'en' === locale ? 'gb' : locale} className="icon-with-text-right" />
                {trans(locale)}
              </>
            }
          >
            <div className="mt-4 mb-5">
              <FormFieldset
                name={selectors.STORE_NAME + '.template'}
                fields={[
                  {
                    name: `contents.${locale}.title`,
                    type: 'string',
                    label: trans('title')
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
          <div className="alert alert-info mt-4">
            {trans('placeholders_info', {}, 'template')}
          </div>

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
  )
}

TemplateShow.propTypes = {
  template: T.shape(
    Template.propTypes
  ),
  placeholders: T.array
}

export {
  TemplateShow
}
