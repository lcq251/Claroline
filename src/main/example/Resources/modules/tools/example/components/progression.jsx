import React from 'react'
import random from 'lodash/random'

import {ContentTitle} from '#/main/app/content/components/title'
import {ProgressBar} from '#/main/app/components/progress-bar'

import {EvaluationGauge} from '#/main/evaluation/components/gauge'
import {constants} from '#/main/evaluation/constants'
import {PageSection} from '#/main/app/page'

const ExampleProgression = () =>
  <PageSection size="xl">
    <ContentTitle title="Progress bars" />

    <div className="mb-3">
      {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'learning'].map(type =>
        <ProgressBar key={type} className="mb-2" variant={type} value={random(0, 100)} />
      )}
    </div>

    <div className="mb-3">
      {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'learning'].map(type =>
        <ProgressBar key={type} className="mb-2" variant={type} value={random(0, 100)} size="xs" />
      )}
    </div>

    <div className="mb-3 d-flex gap-3 align-items-lg-start">
      <EvaluationGauge
        status={constants.EVALUATION_STATUS_NOT_ATTEMPTED}
        size="lg"
      />

      <EvaluationGauge
        status={constants.EVALUATION_STATUS_INCOMPLETE}
        size="lg"
        progression={40}
      />

      <EvaluationGauge
        status={constants.EVALUATION_STATUS_PENDING}
        size="lg"
        progression={100}
      />

      <EvaluationGauge
        status={constants.EVALUATION_STATUS_PASSED}
        size="lg"
        progression={100}
      />

      <EvaluationGauge
        status={constants.EVALUATION_STATUS_PASSED}
        size="lg"
        progression={100}
        displayScore={{current: 80, total: 100}}
      />

      <EvaluationGauge
        status={constants.EVALUATION_STATUS_FAILED}
        size="lg"
        progression={100}
      />
    </div>

  </PageSection>

export {
  ExampleProgression
}
