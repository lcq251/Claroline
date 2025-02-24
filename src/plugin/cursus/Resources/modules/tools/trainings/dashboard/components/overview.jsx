import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {PageContent, PageSection} from '#/main/app/page'
import {ContentInfoBlocks} from '#/main/app/content/components/info-block'
import {selectors as toolSelectors} from '#/main/core/tool'
import {constants as listConst} from '#/main/app/content/list/constants'

import {CourseList} from '#/plugin/cursus/course/components/list'
import {selectors} from '#/plugin/cursus/tools/trainings/dashboard/store'
import {TrainingsDashboardCapacity} from '#/plugin/cursus/tools/trainings/dashboard/components/capacity'

const TrainingsDashboardOverview = () => {
  const toolPath = useSelector(toolSelectors.path)

  return (
    <PageContent>
      <PageSection size="full">
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

      <TrainingsDashboardCapacity className="mt-5" />

      <PageSection
        size="full"
        className="mt-5"
        //flush={true}
        /*title={trans('Formations indisponibles')}*/
      >
        <div className="card">
          <div className="d-flex align-items-baseline p-4 pt-3">
            <h2 className="page-section-title h6 mb-0">{trans('Formations indisponibles')}</h2>

            <nav className="nav nav-pills ms-auto fs-sm me-n3">
              <li className="nav-item">
                <a href="#" className="py-2 fw-normal nav-link active">{trans('Pas de session')}</a>
              </li>
              <li className="nav-item">
                <a href="#" className="py-2 fw-normal nav-link">Complètes</a>
              </li>
            </nav>
          </div>

          <CourseList
            className="border-top"
            flush={true}
            path={toolPath}
            name={selectors.STORE_NAME+'.trainingUnavailable'}
            url={['apiv2_cursus_course_list']}
            display={{
              current: listConst.DISPLAY_TABLE,
              available: [listConst.DISPLAY_TABLE]
            }}
          />
        </div>
        {/*<ul>
          <li>Pas de session en cours ou à venir</li>
          <li>Toutes les sessions en cours ou à venir sont complètes</li>
          <li>Pas de formateur</li>
        </ul>*/}

        {/*<hr className="my-5" aria-hidden={true} />*/}
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

        {/*<hr className="my-5" aria-hidden={true} />*/}
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
    </PageContent>
  )
}

export {
  TrainingsDashboardOverview
}
