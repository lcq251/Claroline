import React from 'react'

import {trans} from '#/main/app/intl/translation'

// Skeleton placeholder: real implementation lands in C-5 (landing-ai).
const LandingAi = () => (
  <div className="landing-widget landing-ai text-center p-3">
    {trans('landing-ai', {}, 'widget')}
  </div>
)

export {
  LandingAi
}
