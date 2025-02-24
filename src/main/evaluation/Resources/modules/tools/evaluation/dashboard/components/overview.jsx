import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {PageContent, PageSection} from '#/main/app/page'
import {ContentInfoBlocks} from '#/main/app/content/components/info-block'
import {selectors as toolSelectors} from '#/main/core/tool'

import {StatusChart} from '#/main/evaluation/charts/status/components/chart'
import {ProgressionChart} from '#/main/evaluation/charts/progression/components/chart'
import {ScoreChart} from '#/main/evaluation/charts/score/components/chart'

const EvaluationDashboardOverview = () => {
  const contextId = useSelector(toolSelectors.contextId)

  return (
    <PageContent>
      {false && contextId &&
        <PageSection className="my-4" size="lg">
          <ContentInfoBlocks
            size="lg"
            items={[
              {
                label: "Score total",
                value: props.score ? props.score : 'Aucun',
                help: 'Cette activité n\'est pas notée.'
              }, {
                label: "Conditions de réussite",
                value: props.score ? props.score : 'Aucune'
              }
            ]}
          />
        </PageSection>
      }

      <PageSection size="full" className="text-center pt-5">
        <StatusChart />
      </PageSection>

      <PageSection
        size="lg"
        title={trans('Répartition de la progression des utilisateurs', {}, 'evaluation')}
        className="pb-5"
      >
        <ProgressionChart />
      </PageSection>

      <PageSection
        size="lg"
        title={trans('Répartition des scores des utilisateurs', {}, 'evaluation')}
        className="pb-5"
      >
        <ScoreChart />
      </PageSection>
    </PageContent>
  )
}


export {
  EvaluationDashboardOverview
}
