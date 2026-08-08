import React from 'react'

import {trans} from '#/main/app/intl/translation'

// Skeleton placeholder: real implementation lands in C-2 (landing-hero).
const LandingHero = () => (
  <div className="landing-widget landing-hero text-center p-3">
    {trans('landing-hero', {}, 'widget')}
  </div>
)

export {
  LandingHero
}
