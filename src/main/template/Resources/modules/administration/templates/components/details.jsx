import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router/components/routes'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {ContentLoader} from '#/main/app/content/components/loader'
import {Toolbar} from '#/main/app/action'

import {TemplatePage} from '#/main/template/administration/templates/containers/page'
import {TemplateForm} from '#/main/template/administration/templates/containers/form'
import {selectors} from '#/main/template/administration/templates/store'
import {ContentNav} from '#/main/app/content/components/nav'

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
      <div className="row">
        <div className="col-md-3">
          <ContentNav
            path={props.path + '/' + props.templateType.type + '/' + props.templateType.name}
            type="vertical"
            sections={[].concat(props.templates.map(template => ({
              id: template.id,
              title: (
                <>
                  {template.name}
                  {template.default &&
                    <small>
                      &nbsp;({trans('default')})
                    </small>
                  }
                </>
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
            })), [
              {
                name: 'add',
                type: LINK_BUTTON,
                icon: 'fa fa-fw fa-plus',
                title: trans('add_template'),
                path: `${props.path}/${props.templateType.type}/form`,
                exact: true
              },
            ])}
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
