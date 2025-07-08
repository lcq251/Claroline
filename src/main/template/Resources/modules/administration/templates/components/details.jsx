import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, MenuButton, MODAL_BUTTON} from '#/main/app/buttons'
import {Badge} from '#/main/app/components/badge'
import {PageContent, PageHeading, PageHeadingSkeleton, PageSection} from '#/main/app/page'
import {ToolPage} from '#/main/core/tool'

import {TemplateShow} from '#/main/template/template/components/show'
import {Template, TemplateType} from '#/main/template/prop-types'
import {MODAL_TEMPLATE_FORM} from '#/main/template/template/modals/form'

const TemplateDetails = (props) => {
  return (
    <ToolPage
      title={trans('template_name', {
        name: props.templateType ? trans(get(props.templateType, 'name'), {}, 'template') : trans('loading')
      }, 'template')}
      description={props.templateType ?
        trans(get(props.templateType, 'name')+'_desc', {}, 'template') : undefined
      }
    >
      {isEmpty(props.templateType) &&
        <PageContent className="placeholder-glow">
          <PageHeadingSkeleton
            description={true}
          />
        </PageContent>
      }

      {!isEmpty(props.templateType) &&
        <PageContent className="d-flex flex-column">
          <PageHeading
            title={trans(get(props.templateType, 'name'), {}, 'template')}
            description={trans(get(props.templateType, 'name')+'_desc', {}, 'template')}
          />

          <PageSection className="flex-fill d-flex flex-column">
            <div className="d-flex flex-column align-items-stretch align-content-stretch">
              <span className="mb-2 text-body-secondary text-uppercase fw-semibold fs-sm d-inline-block">{trans('available_templates', {}, 'template')}</span>
              <MenuButton
                className="px-3 py-2 border rounded-2 bg-body text-start fw-light flex-fill mb-4 focus-ring d-flex gap-3 align-items-center"
                menu={{
                  className: 'w-100',
                  items: [
                    {
                      name: 'system',
                      type: CALLBACK_BUTTON,
                      label: (
                        <div className="d-flex gap-2 align-items-baseline" role="presentation">
                          {trans('template_system', {}, 'template')}
                          {-1 === props.templates.findIndex(t => t.default) &&
                            <Badge variant="primary">{trans('default')}</Badge>
                          }
                        </div>
                      ),
                      callback: () => props.loadTemplate(props.templateType.system),
                      active: props.currentTemplate.name === 'system',
                      children:
                        <p className={classes('mb-0 fs-sm', props.currentTemplate.name !=='system' && 'text-body-tertiary')}>
                          {trans('template_system_desc', {}, 'template')}
                        </p>
                    }
                  ].concat(props.templates.map(template => ({
                    name: template.name,
                    type: CALLBACK_BUTTON,
                    label: (
                      <div className="d-flex gap-2 align-items-baseline" role="presentation">
                        {template.name}
                        {template.default &&
                          <Badge variant="primary">{trans('default')}</Badge>
                        }
                      </div>
                    ),
                    callback: () => props.loadTemplate(template),
                    active: props.currentTemplate.name === template.name,
                    children: template.description ?
                      <p className={classes('mb-0 fs-sm', props.currentTemplate.name !== template.name && 'text-body-tertiary')}>{template.description}</p> :
                      <em className={classes('d-block fs-sm', props.currentTemplate.name !== template.name && 'text-body-tertiary')}>{trans('no_description')}</em>
                  })), [
                    {
                      name: 'new',
                      type: MODAL_BUTTON,
                      icon: 'fa fa-fw fa-plus',
                      label: trans('add_template', {}, 'template'),
                      modal: [MODAL_TEMPLATE_FORM, {
                        isNew: true,
                        template: {type: get(props.templateType, 'name')},
                        onSave: (template) => {
                          console.log(template)
                          props.addTemplate(template)
                          props.loadTemplate(template)
                        }
                      }]
                    }
                  ])
                }}
              >
                <div role="presentation">
                  <div className="d-flex gap-2 align-items-baseline" role="presentation">
                    <b>{props.currentTemplate.system ? trans('template_system', {}, 'template') : props.currentTemplate.name}</b>
                    {props.currentTemplate.default &&
                      <Badge variant="primary">{trans('default')}</Badge>
                    }
                  </div>

                  {(props.currentTemplate.system || props.currentTemplate.description) ?
                    <p className="text-body-secondary mb-0 fs-sm">
                      {props.currentTemplate.system ? trans('template_system_desc', {}, 'template') : props.currentTemplate.description}
                    </p> :
                    <em className="text-body-tertiary d-block fs-sm">{trans('no_description')}</em>
                  }
                </div>
                <span className="fa fa-fw fa-chevron-down text-body-tertiary ms-auto" aria-hidden={true} />
              </MenuButton>
            </div>

            <TemplateShow
              template={props.currentTemplate}
              placeholders={props.templateType.placeholders}
              update={props.updateTemplate}
              delete={(template) => props.deleteTemplate(props.templateType.name, template)}
            />
          </PageSection>
        </PageContent>
      }
    </ToolPage>
  )
}

TemplateDetails.propTypes = {
  path: T.string.isRequired,
  templateType: T.shape(
    TemplateType.propTypes
  ),
  currentTemplate: T.shape(
    Template.propTypes
  ),
  templates: T.array,
  addTemplate: T.func.isRequired,
  updateTemplate: T.func.isRequired,
  loadTemplate: T.func.isRequired,
  deleteTemplate: T.func.isRequired
}

export {
  TemplateDetails
}
