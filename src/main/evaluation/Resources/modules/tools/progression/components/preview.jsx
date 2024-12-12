import React from 'react'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {Datetime} from '#/main/app/components/date'
import {ProgressBar} from '#/main/app/components/progress-bar'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {ScoreGauge} from '#/main/core/layout/gauge/components/score'

const ProgressionPreview = () =>
  <div className="d-flex flex-column h-100">
    <div className="d-flex align-items-center gap-3 mb-2">
      <ScoreGauge
        value={0}
        total={100}
        type="learning"
        width={75}
        height={75}
      />
      <div>
        Dernière activité le 20/02/2024 11:17
      </div>
    </div>

    <ul className="list-unstyled mb-0">
      <li className="mt-3 d-flex flex-row align-items-center gap-3">
        <Thumbnail
          size="sm"
          name="Mon parcours 1"
          square={true}
        />
        <div className="flex-fill">
          <div className="fw-bold">Mon parcours 1</div>
          <ProgressBar className="mt-1"
             variant="learning"
             value={75}
             size="xs"
          />
          <span className="fs-sm text-body-secondary"> 3 / 4 étapes (75%)</span>
        </div>
      </li>

      <li className="mt-3 d-flex flex-row align-items-center gap-3">
        <Thumbnail
          size="sm"
          name="Mon parcours 2"
          square={true}
        />
        <div className="flex-fill">
          <div className="fw-bold">Mon parcours 2</div>
          <ProgressBar
            className="mt-1"
            variant="learning"
            value={50}
            size="xs"
          />
          <span className="fs-sm text-body-secondary"> 3 / 3 étapes (50%)</span>
        </div>
      </li>

      <li className="mt-3 d-flex flex-row align-items-center gap-3">
        <Thumbnail
          size="sm"
          name="Mon parcours 1"
          square={true}
        />
        <div className="flex-fill">
          <div className="fw-bold">Mon parcours 3</div>
          <ProgressBar
            className="mt-1"
            variant="learning"
            value={0}
            size="xs"
          />

          <span className="fs-sm text-body-secondary"> 0 / 10 étapes (0%)</span>
        </div>
      </li>
    </ul>

    <Button
      className="btn btn-link ms-auto mt-auto"
      type={CALLBACK_BUTTON}
      label={trans('Continuer mon parcours', {}, 'actions')}
      callback={() => true}
      size="sm"
    >
      <span className="fa fa-arrow-right ms-2" aria-hidden={true} />
    </Button>
  </div>

export {
  ProgressionPreview
}
