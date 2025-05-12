import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {LINK_BUTTON, CALLBACK_BUTTON, MENU_BUTTON} from '#/main/app/buttons'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {PageSection} from '#/main/app/page'
import {selectors as toolSelectors, ToolOverview} from '#/main/core/tool'
import {route as workspaceRoute} from '#/main/core/workspace/routing'

import {selectors} from '#/plugin/cursus/tools/trainings/store'

import {SessionCourseCard} from '#/plugin/cursus/session/components/card'
import {getPeriodStatus} from '#/plugin/cursus/utils'

const MySessionsSection = (props) => {
  const mySessions = useSelector(selectors.mySessions)
  const [status, setStatus] = useState('in_progress')

  const filteredSessions = mySessions
    .filter(session => status === getPeriodStatus(get(session, 'restrictions.dates[0]'), get(session, 'restrictions.dates[1]')))

  return (
    <PageSection
      className="mt-5"
    >
      <div className="d-flex flex-row align-items-baseline mb-3 gap-3">
        <h2 className="page-section-title h6 mb-0 me-auto">{trans('my_courses', {}, 'cursus')}</h2>

        <Button
          className="btn btn-link fw-bold"
          type={MENU_BUTTON}
          label={trans('session_'+status, {}, 'cursus')}
          menu={{
            items: ['in_progress', 'not_started', 'ended'].map(s => ({
              className: status === s ? 'active' : undefined,
              name: s,
              type: CALLBACK_BUTTON,
              label: trans('session_'+s, {}, 'cursus'),
              callback: () => setStatus(s)
            }))
          }}
        >
          <span className="ms-1 fa fa-fw fa-caret-down" aria-hidden={true} />
        </Button>
      </div>

      {isEmpty(filteredSessions) &&
        <ContentPlaceholder
          title={trans('Vous n\'êtes inscrit à aucune formation', {}, 'cursus')}
          help={trans('Lorem ipsum dolor sit amet')}
        />
      }

      {filteredSessions.map(session =>
        <SessionCourseCard
          key={session.id}
          orientation="row"
          size="sm"
          data={session}
          actions={[{
            name: 'open-workspace',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-chevron-right',
            label: trans('open-training', {}, 'actions'),
            displayed: 'desktop' === props.contextType && !!get(session, 'workspace'),
            target: get(session, 'workspace') ? workspaceRoute(get(session, 'workspace')) : ''
          }]}
        />
      )}

      {'desktop' === props.contextType &&
        <Button
          className="btn btn-link mt-3 ms-auto me-n3"
          type={LINK_BUTTON}
          label={trans('browse_trainings_catalog', {}, 'actions')}
          target={`${props.path}/course`}
        >
          <span className="ms-2 fa fa-arrow-right" aria-hidden={true} />
        </Button>
      }
    </PageSection>
  )
}

MySessionsSection.propTypes = {
  path: T.string.isRequired,
  contextType: T.string.isRequired
}

const TrainingsOverview = () => {
  const toolPath = useSelector(toolSelectors.path)
  const contextType = useSelector(toolSelectors.contextType)

  return (
    <ToolOverview>
      <MySessionsSection contextType={contextType} path={toolPath} />

      <PageSection
        className="mt-5"
        title={trans('Mes inscriptions en attente', {}, 'cursus')}
      >
        <ul>
          <li>Inscriptions à des formations sans session</li>
          <li>Inscriptions en attente de validation par un gestionnaire</li>
          <li>Inscriptions en attente de confirmation par l'utilisateur</li>
        </ul>
      </PageSection>

      <PageSection
        className="mt-5 mb-5"
        title={trans('Mes présences', {}, 'cursus')}
      >
        <ul>
          <li>A remplir</li>
          <li>Absences à justifier</li>
        </ul>
      </PageSection>
    </ToolOverview>
  )
}

export {
  TrainingsOverview
}
