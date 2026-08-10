import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {locale} from '#/main/app/intl'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

// className prefix used by the landing stylesheet (see C-8, landing.scss)
const PREFIX = 'claroline-distribution-integration-mindme-ai-landing-features'

/**
 * Default copy (zh primary + en block), C-17 三卡统一.
 * The real content is seeded in DB by the C-8 updater (15.0.105 refreshed the
 * features instance copy); these are only fallbacks for freshly created /
 * empty widget instances.
 *
 * C-17 (D4/D5 用户拍板): 三卡新文案且样式统一 (tone 全 normal, 去 soft 差异化) —
 * 卡1 DIY工具「适配工具，辅助教学」/ 卡2「个性学习」「ai助学，自主可控」/
 * 卡3 Idea展示「灵感乍现，嵌入支撑」。en 同步: DIY Tools / Personalized
 * Learning + "AI tutoring, self-controlled" / Idea Showcase + "Inspiration
 * sparks, embedded support"。
 */
const DEFAULT_CONTENT = {
  zh: {
    title: '平台特色',
    subtitle: '三大能力，一个平台',
    cards: [
      {
        icon: 'fa fa-fw fa-tools',
        title: 'DIY工具',
        desc: '适配工具，辅助教学',
        href: '#feature-1',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-robot',
        title: '个性学习',
        desc: 'ai助学，自主可控',
        href: '#feature-2',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-lightbulb',
        title: 'Idea展示',
        desc: '灵感乍现，嵌入支撑',
        href: '#feature-3',
        tone: 'normal'
      }
    ]
  },
  en: {
    title: 'Platform Features',
    subtitle: 'Three capabilities, one platform',
    cards: [
      {
        icon: 'fa fa-fw fa-tools',
        title: 'DIY Tools',
        desc: 'Adaptable tools, assisted teaching',
        href: '#feature-1',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-robot',
        title: 'Personalized Learning',
        desc: 'AI tutoring, self-controlled',
        href: '#feature-2',
        tone: 'normal'
      },
      {
        icon: 'fa fa-fw fa-lightbulb',
        title: 'Idea Showcase',
        desc: 'Inspiration sparks, embedded support',
        href: '#feature-3',
        tone: 'normal'
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
            // C-13 方案 B 遗留: 旧数据的 soft/dark tone 仍映射 card-soft 类
            // (向后兼容); C-17 起 SCSS 已删除 .card-soft 差异化样式, 三卡视觉
            // 完全一致 (D3 去 soft)
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
