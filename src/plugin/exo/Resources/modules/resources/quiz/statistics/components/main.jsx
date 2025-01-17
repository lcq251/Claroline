import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router/components/routes'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Nav} from '#/main/app/components/nav'

import {AnswersStats} from '#/plugin/exo/resources/quiz/statistics/containers/answers'
import {AttemptsStats} from '#/plugin/exo/resources/quiz/statistics/containers/attempts'
import {Docimology} from '#/plugin/exo/resources/quiz/statistics/containers/docimology'
import {ResourcePage} from '#/main/core/resource'
import {PageContent} from '#/main/app/page'

const StatisticsMain = props =>
  <ResourcePage>
    <PageContent>
      <Nav
        orientation="horizontal"
        variant="underline"
        items={[
          {
            name: 'answers',
            type: LINK_BUTTON,
            label: trans('Réponses des utilisateurs'),
            target: `${props.path}/statistics/answers`,
            exact: true
          }, {
            name: 'attempts',
            type: LINK_BUTTON,
            label: trans('Evolution des tentatives', {}, 'quiz'),
            target: `${props.path}/statistics/attempts`
          }, {
            name: 'docimology',
            type: LINK_BUTTON,
            label: trans('Docimologie', {}, 'quiz'),
            target: `${props.path}/statistics/docimology`
          }
        ]}
      />

      <Routes
        path={`${props.path}/statistics`}
        redirect={[
          {from: '/', exact: true, to: '/answers'}
        ]}
        routes={[
          {
            path: '/answers',
            component: AnswersStats,
            onEnter: () => props.statistics(props.quizId)
          }, {
            path: '/attempts',
            component: AttemptsStats
          }, {
            path: '/docimology',
            component: Docimology,
            onEnter: () => props.docimology(props.quizId)
          }
        ]}
      />
    </PageContent>
  </ResourcePage>

StatisticsMain.propTypes = {
  path: T.string.isRequired,
  quizId: T.string.isRequired,
  statistics: T.func.isRequired,
  docimology: T.func.isRequired
}

export {
  StatisticsMain
}
