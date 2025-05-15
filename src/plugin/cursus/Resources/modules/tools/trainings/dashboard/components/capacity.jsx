import React, {useState} from 'react'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'

import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {SessionList} from '#/plugin/cursus/session/components/list'
import {selectors} from '#/plugin/cursus/tools/trainings/dashboard/store'
import {constants as listConst} from '#/main/app/content/list'
import {hasPermission} from '#/main/app/security'
import {MODAL_SESSION_CANCEL} from '#/plugin/cursus/session/modals/cancel'
import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/form'
import {PageSection} from '#/main/app/page'
import {useSelector} from 'react-redux'
import {selectors as toolSelectors} from '#/main/core/tool'
import {DataMicro} from '#/main/app/data/components/micro'

const TrainingsDashboardCapacity = (props) => {
  const toolPath = useSelector(toolSelectors.path)
  const contextType = useSelector(toolSelectors.contextType)
  const contextId = useSelector(toolSelectors.contextId)

  const [sessionCapacity, setSessionCapacity] = useState('incomplete')

  return (
    <PageSection size="full" className={props.className}>
      <div className="card">
        <div className="d-flex align-items-baseline pt-3 p-4">
          <h2 className="page-section-title h6 mb-0">Capacité des sessions</h2>

          <nav className="nav nav-pills ms-auto fs-sm me-n3">
            <li className="nav-item">
              <Button
                className={classes('py-2 fw-normal nav-link', {
                  active: 'incomplete' === sessionCapacity
                })}
                type={CALLBACK_BUTTON}
                label={trans('Incomplètes', {}, 'cursus')}
                callback={() => setSessionCapacity('incomplete')}
              />
            </li>
            <li className="nav-item">
              <Button
                className={classes('py-2 fw-normal nav-link', {
                  active: 'complete' === sessionCapacity
                })}
                type={CALLBACK_BUTTON}
                label={trans('Complètes', {}, 'cursus')}
                callback={() => setSessionCapacity('complete')}
              />
            </li>
          </nav>
        </div>

        <SessionList
          className="border-top"
          flush={true}
          path={toolPath}
          name={selectors.STORE_NAME+'.sessionCapacity'}
          url={['apiv2_cursus_session_context_list', {context: contextType, contextId: contextId}]}
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
          display={{
            current: listConst.DISPLAY_TABLE,
            available: [listConst.DISPLAY_TABLE]
          }}
          actions={(rows) => {
            if ('incomplete' === sessionCapacity) {
              return [{
                name: 'cancel',
                type: MODAL_BUTTON,
                icon: 'fa fa-fw fa-ban',
                label: trans('cancel', {}, 'actions'),
                displayed: hasPermission('edit', rows[0]),
                group: trans('management'),
                scope: ['object', 'collection'],
                modal: [MODAL_SESSION_CANCEL, {
                  sessions: rows
                }],
                dangerous: true
              }]
            }

            return [{
              name: 'plan-session',
              type: MODAL_BUTTON,
              icon: 'fa fa-fw fa-plus',
              label: trans('plan_training_session', {}, 'actions'),
              scope: ['object'],
              modal: [MODAL_SESSION_FORM, {
                course: rows[0].course
              }]
            }]
          }}
        />
      </div>
    </PageSection>
  )
}

export {
  TrainingsDashboardCapacity
}
