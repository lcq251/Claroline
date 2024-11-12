import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router/components/routes'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {Vertical} from '#/main/app/content/tabs/components/vertical'
import {ContentLoader} from '#/main/app/content/components/loader'
import {Toolbar} from '#/main/app/action'

import {TemplatePage} from '#/main/template/administration/templates/containers/page'
import {TemplateForm} from '#/main/template/administration/templates/containers/form'
import {selectors} from '#/main/template/administration/templates/store'

const TemplateDetails = (props) => {
  if (isEmpty(props.templateType)) {
    return (
      <ContentLoader
        size="lg"
        description={trans('loading', {}, 'template')}
      />
    )
  }

  let currentTemplate = useSelector(selectors.template)

  return (
    <TemplatePage
      templateType={props.templateType}
    >
      {false && !isEmpty(currentTemplate) &&
        <div className="p-4">
          <h1 className="h4">{currentTemplate.name}</h1>
          <p className="lead">{currentTemplate.description || <em>{trans('no_description')}</em>}</p>

          <Toolbar
            primaryAction="add"
            actions={[
              {
                name: 'add',
                type: LINK_BUTTON,
                icon: 'fa fa-fw fa-plus',
                label: trans('add_template'),
                target: `${props.path}/${props.templateType.type}/${props.templateType.id}/form`,
                primary: true,
                exact: true
              }, {
                name: 'delete',
                type: CALLBACK_BUTTON,
                icon: 'fa fa-fw fa-trash',
                label: trans('delete', {}, 'actions'),
                displayed: !currentTemplate.system,
                callback: () => props.deleteTemplate(props.templateType.id, currentTemplate.id),
                confirm: {
                  title: trans('template_delete_confirm', {}, 'template'),
                  message: trans('template_delete_confirm_message', {}, 'template')
                },
                dangerous: true
              }
            ]}
          />
        </div>
      }

      <div className="row">
        <div className="col-md-3">
          <Vertical
            basePath={props.path + '/' + props.templateType.type + '/' + props.templateType.name}
            tabs={props.templates.map(template => ({
              id: template.id,
              title: (
                <Fragment>
                  {template.name}
                  {template.default &&
                    <small>
                      &nbsp;({trans('default')})
                    </small>
                  }
                </Fragment>
              ),
              path: `/${template.id}`,
              actions: [
                {
                  name: 'delete',
                  type: CALLBACK_BUTTON,
                  icon: 'fa fa-fw fa-trash',
                  label: trans('delete', {}, 'actions'),
                  displayed: !template.system,
                  callback: () => props.deleteTemplate(props.templateType.id, template.id),
                  confirm: {
                    title: trans('template_delete_confirm', {}, 'template'),
                    message: trans('template_delete_confirm_message', {}, 'template')
                  },
                  dangerous: true
                }
              ]
            }))}
          />
        </div>

        <div className="col-md-9">
          <Routes
            path={props.path + '/' + props.templateType.type + '/' + props.templateType.name}
            redirect={[
              {from: '/', exact: true, to: '/'+props.templates[0].id, disabled: isEmpty(props.templates)}
            ]}
            routes={[
              {
                path: '/form',
                component: TemplateForm,
                onEnter: () => props.openForm(props.templateType, props.defaultLocale),
                onLeave: () => props.resetForm(props.templateType, props.defaultLocale)
              }, {
                path: '/:id',
                component: TemplateForm,
                onEnter: (params) => props.openForm(props.templateType, props.defaultLocale, params.id || null),
                onLeave: () => props.resetForm(props.templateType, props.defaultLocale)
              }
            ]}
          />
        </div>
      </div>
    </TemplatePage>
  )
}

TemplateDetails.propTypes = {
  path: T.string.isRequired,
  templateType: T.shape({
    // TemplateTypeTypes.propTypes
  }),
  templates: T.array,

  defaultLocale: T.string.isRequired,
  openForm: T.func.isRequired,
  resetForm: T.func.isRequired,
  deleteTemplate: T.func.isRequired
}

export {
  TemplateDetails
}
