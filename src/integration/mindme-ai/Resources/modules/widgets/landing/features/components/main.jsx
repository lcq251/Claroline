import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {locale} from '#/main/app/intl'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

// className prefix used by the landing stylesheet (see C-8, landing.scss)
const PREFIX = 'claroline-distribution-integration-mindme-ai-landing-features'

/**
 * Default copy (zh primary + en block), C-13 方案 B 精简文案.
 * The real content is seeded in DB by the C-8 updater (15.0.101 refreshed the
 * features instance copy); these are only fallbacks for freshly created /
 * empty widget instances.
 *
 * 方案 B 深底升级 (design/landing/features-b.html): 区块深青海报底反白,
 * 标题「平台特色」+ 副标「三大能力，一个平台」, 3 张精简卡 (icon / title / desc),
 * num / en / link 不再渲染 (旧参数存在时忽略, 向后兼容)。
 */
const DEFAULT_CONTENT = {
  zh: {
    title: '平台特色',
    subtitle: '三大能力，一个平台',
    cards: [
      {
        icon: 'fa fa-fw fa-chalkboard-teacher',
        title: '老师工具',
        desc: '备课授课，AI 提效',
        href: '#feature-1',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-graduation-cap',
        title: '学习方法',
        desc: 'AI 助教，因材施教',
        href: '#feature-2',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-cubes',
        title: 'AI 平台',
        desc: '基座安全，开箱即用',
        href: '#feature-3',
        tone: 'soft'
      }
    ]
  },
  en: {
    title: 'Platform Features',
    subtitle: 'Three capabilities, one platform',
    cards: [
      {
        icon: 'fa fa-fw fa-chalkboard-teacher',
        title: 'For Teachers',
        desc: 'Prep & teach, AI-boosted',
        href: '#feature-1',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-graduation-cap',
        title: 'For Learners',
        desc: 'AI tutor, teach to each',
        href: '#feature-2',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-cubes',
        title: 'AI-Native',
        desc: 'Safe AI core, out of the box',
        href: '#feature-3',
        tone: 'soft'
      }
    ]
  }
}

const LandingFeaturesComponent = props => {
  const defaults = DEFAULT_CONTENT[locale()] || DEFAULT_CONTENT.zh
  const parameters = props.parameters || {}
  // bilingual seed: the C-8 updater stores the complete English copy under the
  // `en` key; prefer it when the visitor locale matches, fall back to the flat
  // (zh primary, admin-editable) parameters then to the component defaults.
  const localized = parameters[locale()] || {}

  const title = localized.title || parameters.title || defaults.title
  const subtitle = localized.subtitle || parameters.subtitle || defaults.subtitle
  const cards = Array.isArray(localized.cards)
    ? localized.cards
    : (Array.isArray(parameters.cards) ? parameters.cards : defaults.cards)

  return (
    <section className={`landing-widget ${PREFIX}`}>
      <div className={`${PREFIX}-content`}>
        <div className={`${PREFIX}-head`}>
          <h2 className={`${PREFIX}-title`}>{title}</h2>
          {subtitle &&
            <p className={`${PREFIX}-subtitle`}>{subtitle}</p>
          }
        </div>

        <div className={`${PREFIX}-grid`}>
          {cards.map((card, index) => {
            // C-13 方案 B: 第 3 卡浅青差异化; legacy `dark` tone (旧 seed) 一并映射
            const soft = 'soft' === card.tone || 'dark' === card.tone

            return (
              <article
                key={index}
                className={classes(`${PREFIX}-card`, {[`${PREFIX}-card-soft`]: soft})}
              >
                {card.icon &&
                  <span className={`${PREFIX}-icon-badge`} aria-hidden="true">
                    <i className={classes(`${PREFIX}-icon`, card.icon)} />
                  </span>
                }
                <h3 className={`${PREFIX}-name`}>{card.title}</h3>
                <p className={`${PREFIX}-desc`}>{card.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

LandingFeaturesComponent.propTypes = {
  parameters: T.shape({
    title: T.string,
    subtitle: T.string,
    // deep-teal gradient (spec §6 schema; rendered by the stylesheet, D6)
    background: T.string,
    cards: T.arrayOf(T.shape({
      // legacy fields (num / en / href) are accepted for backward compatibility
      // but no longer rendered in the C-13 layout
      num: T.string,
      icon: T.string,
      title: T.string,
      desc: T.string,
      en: T.string,
      href: T.string,
      tone: T.string
    })),
    // complete English copy (rendered by the features component for en visitors)
    en: T.shape({
      title: T.string,
      subtitle: T.string,
      cards: T.arrayOf(T.shape({
        icon: T.string,
        title: T.string,
        desc: T.string,
        tone: T.string
      }))
    })
  })
}

const LandingFeatures = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(LandingFeaturesComponent)

export {
  LandingFeatures
}
