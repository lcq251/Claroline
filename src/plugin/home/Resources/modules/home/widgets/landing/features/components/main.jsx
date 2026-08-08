import React from 'react'

import {trans} from '#/main/app/intl/translation'

// Skeleton placeholder: real implementation lands in C-4 (landing-features).
const LandingFeatures = () => (
  <div className="landing-widget landing-features text-center p-3">
    {trans('landing-features', {}, 'widget')}
  </div>
)

export {
  LandingFeatures
}
