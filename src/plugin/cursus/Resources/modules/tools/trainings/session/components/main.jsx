import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router/components/routes'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {ToolPage} from '#/main/core/tool'
import {route as workspaceRoute} from '#/main/core/workspace/routing'
import {PageListSection} from '#/main/app/page/components/list-section'
import {selectors as toolSelectors} from '#/main/core/tool'

import {SessionList} from '#/plugin/cursus/session/components/list'
import {selectors} from '#/plugin/cursus/tools/trainings/session/store/selectors'

import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/parameters'
import {MODAL_TRAINING_COURSES} from '#/plugin/cursus/modals/courses'
import {hasPermission} from '#/main/app/security'
import {DataMicro} from '#/main/app/data/components/micro'

const SessionMain = (props) => {
  const contextType = useSelector(toolSelectors.contextType)
  const contextId = useSelector(toolSelectors.contextId)
  const canCreateSession = useSelector(state => toolSelectors.hasPermission('edit', state))

  return (
    <Routes
      path={`${props.path}/sessions`}
      routes={[
        {
          path: '/',
          exact: true,
          onEnter: () => props.invalidateList(),
          render: () => (
            <ToolPage
              title={trans('sessions', {}, 'cursus')}
            >
              <PageListSection>
                <SessionList
                  flush={true}
                  path={props.path}
                  name={selectors.STORE_NAME}
                  url={['apiv2_cursus_session_context_list', {context: contextType, contextId: contextId}]}
                  addAction={{
                    type: MODAL_BUTTON,
                    label: trans('plan_training_session', {}, 'actions'),
                    modal: [MODAL_TRAINING_COURSES, {
                      multiple: false,
                      selectAction: (selected) => ({
                        type: MODAL_BUTTON,
                        label: trans('plan_training_session', {}, 'actions'),
                        modal: [MODAL_SESSION_FORM, {
                          course: selected[0],
                          onSave: props.invalidateList
                        }]
                      })
                    }],
                    displayed: canCreateSession
                  }}
                  delete={{
                    url: ['apiv2_cursus_session_delete'],
                    displayed: (rows) => -1 !== rows.findIndex(row => hasPermission('delete', row))
                  }}
                  customDefinition={[
                    {
                      name: 'name',
                      type: 'string',
                      label: trans('name'),
                      displayed: 'desktop' === contextType,
                      displayable: 'desktop' === contextType,
                      primary: true,
                      render: (course) => <DataMicro object={course} />,
                      order: 1
                    }, {
                      name: 'course',
                      type: 'training_course',
                      label: trans('course', {}, 'cursus'),
                      displayable: false,
                      sortable: false,
                      filterable: 'desktop' === contextType
                    }
                  ]}
                  customActions={(rows) => [
                    {
                      name: 'open-workspace',
                      type: LINK_BUTTON,
                      icon: 'fa fa-fw fa-book',
                      label: trans('open-workspace', {}, 'actions'),
                      target: rows[0].workspace ? workspaceRoute(rows[0].workspace) : '',
                      displayed: !!rows[0].workspace,
                      scope: ['object']
                    }
                  ]}
                />
              </PageListSection>
            </ToolPage>
          )
        }
      ]}
    />
  )
}

SessionMain.propTypes = {
  path: T.string.isRequired,
  invalidateList: T.func.isRequired
}

export {
  SessionMain
}
