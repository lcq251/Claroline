import React from 'react'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {Datetime} from '#/main/app/components/date'

const AnnouncementPreview = () =>
  <>
    <h4 className="fs-sm text-body-secondary text-uppercase d-flex align-items-center gap-3">
      Dernières annonces

      <Button
        className="btn btn-link ms-auto"
        type={CALLBACK_BUTTON}
        label={trans('see_all', {}, 'actions')}
        callback={() => true}
        size="sm"
      >
        <span className="fa fa-arrow-right ms-2" aria-hidden={true} />
      </Button>
    </h4>
    <ul className="list-unstyled mb-0">
      <li className="mt-3">
        <Datetime
          className="fs-sm text-body-secondary"
          value={'2024-12-12\T11:30:00'} long={true} time={false}
        />
        <div className="fw-bold">Titre de mon annonce 1</div>
      </li>

      <li className="mt-3">
        <Datetime
          className="fs-sm text-body-secondary"
          value={'2024-12-12\T11:30:00'} long={true} time={false}
        />
        <div className="fw-bold">Titre de mon annonce 2</div>
      </li>

      <li className="mt-3">
        <Datetime
          className="fs-sm text-body-secondary"
          value={'2024-12-12\T11:30:00'} long={true} time={false}
        />
        <div className="fw-bold">Titre de mon annonce 3</div>
      </li>
    </ul>
  </>

export {
  AnnouncementPreview
}
