import React from 'react'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {Datetime} from '#/main/app/components/date'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {DataMicro} from '#/main/app/data/components/micro'

const BadgesPreview = () =>
  <>
    <h4 className="fs-sm text-body-secondary text-uppercase d-flex align-items-center gap-3">
      Derniers badges obtenus

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

    <ul className="list-unstyled mb-0 fw-bolder">
      <li className="mt-3 d-flex flex-row align-items-center gap-3">
        <DataMicro object={{name: 'Badge 1'}} />
        {/*<Thumbnail
          size="sm"
          name="Badge 1"
          square={true}
        />
        <div className="" role="presentation">
          <Datetime
            className="fs-sm text-body-secondary"
            value={'2024-12-12\T11:30:00'} long={true} time={false}
          />
          <div className="fw-bold">Badge 1</div>
        </div>*/}
      </li>

      <li className="mt-3 d-flex flex-row align-items-center gap-3">
        <DataMicro object={{name: 'Badge 2'}} />
        {/*<Thumbnail
          size="sm"
          name="Badge 2"
          square={true}
        />
        <div className="" role="presentation">
          <Datetime
            className="fs-sm text-body-secondary"
            value={'2024-12-12\T11:30:00'} long={true} time={false}
          />
          <div className="fw-bold">Badge 2</div>
        </div>*/}
      </li>

      <li className="mt-3 d-flex flex-row align-items-center gap-3">
        <DataMicro object={{name: 'Badge 3'}} />
        {/*<Thumbnail
          size="sm"
          name="Badge 3"
          square={true}
        />
        <div className="" role="presentation">
          <Datetime
            className="fs-sm text-body-secondary"
            value={'2024-12-12\T11:30:00'} long={true} time={false}
          />
          <div className="fw-bold">Badge 3</div>
        </div>*/}
      </li>
    </ul>
  </>

export {
  BadgesPreview
}
