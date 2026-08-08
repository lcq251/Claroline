import React from 'react'

import {trans} from '#/main/app/intl/translation'

// Skeleton placeholder: real implementation lands in C-7 (landing-cta).
const LandingCta = () => (
  <div className="landing-widget landing-cta text-center p-3">
    {trans('landing-cta', {}, 'widget')}
  </div>
)

export {
  LandingCta
}
