import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {selectors as contentSelectors} from '#/main/core/widget/content/store'

/**
 * Default packaging targets (zh main copy, per C-6 card).
 * Shown when the widget instance has no configured platforms yet.
 */
const DEFAULT_TITLE = '一处建设，处处可达'
const DEFAULT_SUBTITLE = '平台提供打包环境，一套内容，多端分发'

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
  const parameters = useSelector(contentSelectors.parameters)

  const title = parameters.title || DEFAULT_TITLE
  const subtitle = parameters.subtitle || DEFAULT_SUBTITLE

  // undefined platforms -> preset showcase; explicit empty array -> no cards
  const platforms = Array.isArray(parameters.platforms)
    ? parameters.platforms
    : DEFAULT_PLATFORMS

  return (
    <section className="landing-widget landing-packaging l-section">
      <div className="l-container">
        <div className="l-section-head">
          <span className="l-kicker">Packaging</span>
          <h2>{title}</h2>
          {subtitle &&
            <p>{subtitle}</p>
          }
        </div>

        {0 < platforms.length &&
          <div className="pkg-grid">
            {platforms.map((platform, index) =>
              <div className="l-card pkg-card" key={index}>
                <DeviceIcon icon={platform.icon} />

                <h3>{platform.name}</h3>
                {platform.desc &&
                  <p>{platform.desc}</p>
                }
                {DEVICE_EN_LABELS[platform.icon] &&
                  <span className="l-en">{DEVICE_EN_LABELS[platform.icon]}</span>
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
