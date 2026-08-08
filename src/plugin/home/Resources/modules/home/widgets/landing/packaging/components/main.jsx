import React from 'react'

import {trans} from '#/main/app/intl/translation'

// Skeleton placeholder: real implementation lands in C-6 (landing-packaging).
const LandingPackaging = () => (
  <div className="landing-widget landing-packaging text-center p-3">
    {trans('landing-packaging', {}, 'widget')}
  </div>
)

export {
  LandingPackaging
}
