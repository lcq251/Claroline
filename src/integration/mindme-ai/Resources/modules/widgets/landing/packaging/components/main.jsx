import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {locale} from '#/main/app/intl'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

// className prefix used by the landing stylesheet (see C-8, landing.scss)
const PREFIX = 'claroline-distribution-integration-mindme-ai-landing-packaging'

/**
 * Default packaging targets (zh main copy, per C-6 card).
 * Shown when the widget instance has no configured platforms yet.
 *
 * C-14 浅色系 (D7 用户拍板): 无英文 kicker, 标题「一处编译，多端访问」+
 * 副标「一套代码，多端运行」。
 */
const DEFAULT_TITLE = '一处编译，多端访问'
const DEFAULT_SUBTITLE = '一套代码，多端运行'

// English fallbacks (C-14, D7 en 文案)
const DEFAULT_EN_TITLE = 'Build once, run everywhere'
const DEFAULT_EN_SUBTITLE = 'One codebase, every device'

const DEFAULT_PLATFORMS = [
  {icon: 'mini', name: '小程序', desc: '轻量即用，随时学习'},
  {icon: 'desktop', name: '桌面', desc: '完整功能，高效教学'},
  {icon: 'app', name: '应用', desc: '移动端随行，处处可学'}
]

// English placeholder labels ("en 占位" position under each card, see design prototype).
const DEVICE_EN_LABELS = {
  mini: 'Mini program',
  desktop: 'Desktop app',
  app: 'Mobile app'
}

/**
 * Pure-CSS flat device icon (mini-program / desktop / app), per design/landing prototypes.
 */
const DeviceIcon = (props) => {
  if ('desktop' === props.icon) {
    return (
      <div className="dev dev--desk" aria-hidden="true">
        <div className="frame"><div className="screen"><i /></div></div>
        <div className="stand" />
        <div className="base" />
      </div>
    )
  }

  if ('app' === props.icon) {
    return (
      <div className="dev dev--app" aria-hidden="true">
        <div className="frame"><div className="screen"><i /><i /><i /><i /></div></div>
      </div>
    )
  }

  return (
    <div className="dev dev--mini" aria-hidden="true">
      <div className="frame"><div className="screen"><i /></div></div>
    </div>
  )
}

DeviceIcon.propTypes = {
  icon: T.string
}

/**
 * Landing packaging widget: showcases packaging targets
 * (mini-program / desktop / mobile app) as configurable platform cards.
 */
const LandingPackaging = () => {
  const parameters = useSelector(contentSelectors.parameters) || {}
  // bilingual seed: the C-8 updater stores the complete English copy under the
  // `en` key; prefer it when the visitor locale matches, fall back to the flat
  // (zh primary, admin-editable) parameters then to the component defaults.
  const localized = parameters[locale()] || {}

  const defaults = 'en' === locale()
    ? {title: DEFAULT_EN_TITLE, subtitle: DEFAULT_EN_SUBTITLE}
    : {title: DEFAULT_TITLE, subtitle: DEFAULT_SUBTITLE}

  const title = localized.title || parameters.title || defaults.title
  const subtitle = localized.subtitle || parameters.subtitle || defaults.subtitle

  // undefined platforms -> preset showcase; explicit empty array -> no cards
  const platforms = !isEmpty(localized.platforms)
    ? localized.platforms
    : (Array.isArray(parameters.platforms) ? parameters.platforms : DEFAULT_PLATFORMS)

  return (
    <section className={`landing-widget ${PREFIX}`}>
      <div className={`${PREFIX}-content`}>
        <div className={`${PREFIX}-head`}>
          <h2 className={`${PREFIX}-title`}>{title}</h2>
          {subtitle &&
            <p className={`${PREFIX}-subtitle`}>{subtitle}</p>
          }
        </div>

        {0 < platforms.length &&
          <div className={`${PREFIX}-grid`}>
            {platforms.map((platform, index) =>
              <div className={`${PREFIX}-card`} key={index}>
                <DeviceIcon icon={platform.icon} />

                <h3 className={`${PREFIX}-name`}>{platform.name}</h3>
                {platform.desc &&
                  <p className={`${PREFIX}-desc`}>{platform.desc}</p>
                }
                {DEVICE_EN_LABELS[platform.icon] &&
                  <span className={`${PREFIX}-en`}>{DEVICE_EN_LABELS[platform.icon]}</span>
                }
              </div>
            )}
          </div>
        }
      </div>
    </section>
  )
}

export {
  LandingPackaging
}
