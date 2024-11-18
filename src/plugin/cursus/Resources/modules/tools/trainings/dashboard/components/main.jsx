import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'

import {PageSection} from '#/main/app/page'
import {ContentInfoBlocks} from '#/main/app/content/components/info-block'
import {ToolPage, selectors as toolSelectors} from '#/main/core/tool'

import {SessionList} from '#/plugin/cursus/session/components/list'
import {selectors} from '#/plugin/cursus/tools/trainings/session/store'
import {Cell, Pie, PieChart, ResponsiveContainer} from 'recharts'

const TrainingsDashboard = () => {
  const toolPath = useSelector(toolSelectors.path)
  const contextType = useSelector(toolSelectors.contextType)
  const contextId = useSelector(toolSelectors.contextId)

  return (
    <ToolPage title={trans('Suivi des formations')}>
      <PageSection size="full" className="my-5">
        <ContentInfoBlocks
          size="lg"
          items={[
            {
              icon: 'fa fa-graduation-cap',
              label: trans('courses', {}, 'cursus'),
              value: 25
            }, {
              icon: 'fa fa-chalkboard-teacher',
              label: trans('Sessions en cours', {}, 'cursus'),
              value: 3
            }, {
              icon: 'fa fa-chalkboard-teacher',
              label: trans('tutors', {}, 'cursus'),
              value: 10
            }, {
              icon: 'fa fa-user',
              label: trans('users'),
              value: 500
            }
          ]}
        />
      </PageSection>

      <div className="row">
        <div className="col-8">
          <PageSection size="full">
            <div className="card">
              <div className="d-flex align-items-baseline p-4 pt-3">
                <h2 className="page-section-title h6 mb-0">Sessions</h2>

                <nav className="nav nav-pills ms-auto">
                  <li className="nav-item">
                    <a href="#" className="py-2 fw-normal nav-link active">Incomplètes</a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="py-2 fw-normal nav-link">Complètes</a>
                  </li>
                </nav>
              </div>

              <SessionList
                className="border-top"
                flush={true}
                path={toolPath}
                name={selectors.STORE_NAME}
                url={['apiv2_cursus_session_context_list', {context: contextType, contextId: contextId}]}
                customDefinition={[
                  {
                    name: 'course',
                    type: 'training_course',
                    label: trans('course', {}, 'cursus'),
                    displayed: 'desktop' === contextType,
                    primary: true,
                    order: 1
                  }
                ]}
              />
            </div>
          </PageSection>
        </div>

        <div className="col-4">
          <PageSection size="full">
            <div className="card">
              <div className="d-flex align-items-baseline p-4">
                <h2 className="page-section-title h6 mb-0 pt-0">Capacité d'accueil</h2>
              </div>
              <div className="card-body">
                <ResponsiveContainer height={200} width={200}>
                  <PieChart onMouseEnter={null}>
                    <Pie
                      data={[
                        { name: 'Complète', value: 400 },
                        { name: 'Incomplète', value: 300 },
                      ]}
                      cx={120}
                      cy={200}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell key={`cell-complete`} fill="var(--bs-primary)" />
                      <Cell key={`cell-incomplete`} fill="var(--bs-primary-subtle)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </PageSection>
        </div>
      </div>
      <PageSection
        size="full"
        className="mt-5"
        title={trans('Formations indisponibles')}
      >
        <ul>
          <li>Pas de session en cours ou à venir</li>
          <li>Toutes les sessions en cours ou à venir sont complètes</li>
          <li>Pas de formateur</li>
        </ul>
      </PageSection>

      <PageSection
        size="full"
        className="mt-5"
        title={trans('Inscriptions en attente')}
      >
        <ul>
          <li>En attente de validation par un gestionnaire</li>
          <li>En attente de l'ouverture d'une nouvelle session</li>
        </ul>
      </PageSection>

      <PageSection
        size="full"
        className="mt-5"
        title={trans('Présences')}
      >
        <ul>
          <li>En attente de validation par un gestionnaire</li>
          <li>En attente de l'ouverture d'une nouvelle session</li>
        </ul>
      </PageSection>
    </ToolPage>
  )
}

export {
  TrainingsDashboard
}
