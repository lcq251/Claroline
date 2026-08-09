import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {locale} from '#/main/app/intl'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

// Default section title (zh primary; admin can override it in the widget parameters).
const DEFAULT_TITLE = '三大块，一个平台'

// Default feature cards (zh primary + en placeholder, matching the landing design).
const DEFAULT_CARDS = [
  {
    num: '01 · TEACHER',
    icon: 'fa fa-fw fa-chalkboard-teacher',
    title: '为老师提供教学工具',
    desc: '备课、授课、布置、评估，AI 加持提效',
    en: 'Tools for teachers',
    href: '#feature-1',
    tone: 'normal'
  },
  {
    num: '02 · LEARNER',
    icon: 'fa fa-fw fa-graduation-cap',
    title: '为学生提供学习方法',
    desc: '个性化学习路径、AI 助教陪伴、学情反馈',
    en: 'Learning methods',
    href: '#feature-2',
    tone: 'normal'
  },
  {
    num: '03 · PLATFORM',
    icon: 'fa fa-fw fa-cubes',
    title: 'AI 功能嵌入式平台',
    desc: '提供 AI 基座与安全，开箱即用',
    en: 'AI-native platform',
    href: '#feature-3',
    tone: 'dark'
  }
]

/**
 * Restricts rendered hrefs to safe URL schemes.
 * Widget parameters are admin-provided, but we still refuse
 * javascript:/data:/vbscript: URLs as a defense-in-depth measure.
 */
function sanitizeHref(href) {
  if (typeof href !== 'string') {
    return undefined
  }

  const value = href.trim()
  if (0 === value.length) {
    return undefined
  }

  const schemeMatch = value.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/)
  if (schemeMatch) {
    const protocol = schemeMatch[1].toLowerCase()
    if (-1 === ['http', 'https', 'mailto', 'tel'].indexOf(protocol)) {
      return undefined
    }
  }

  return value
}

const LandingFeaturesComponent = props => {
  const parameters = props.parameters || {}
  // bilingual seed: the C-8 updater stores the complete English copy under the
  // `en` key; prefer it when the visitor locale matches, fall back to the flat
  // (zh primary, admin-editable) parameters then to the component defaults.
  const localized = parameters[locale()] || {}

  const title = localized.title || parameters.title || DEFAULT_TITLE
  const cards = !isEmpty(localized.cards) ? localized.cards : (isEmpty(parameters.cards) ? DEFAULT_CARDS : parameters.cards)

  return (
    <section className="landing-widget landing-features l-section">
      <div className="l-container">
        <div className="l-section-head">
          <h2>{title}</h2>
        </div>

        <div className="feat-grid">
          {cards.map((card, index) => {
            const href = sanitizeHref(card.href)

            return (
              <article
                key={index}
                className={classes('feat-card', {'feat-card--dark': 'dark' === card.tone})}
              >
                {card.icon &&
                  <i className={classes('feat-icon', card.icon)} aria-hidden="true" />
                }
                <span className="feat-num">{card.num || `0${index + 1}`}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                {card.en &&
                  <span className="l-en">{card.en}</span>
                }
                {href &&
                  <a className="l-btn--text" href={href}>
                    {trans('landing_features_learn_more', {}, 'widget')} →
                  </a>
                }
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
    cards: T.arrayOf(T.shape({
      num: T.string,
      icon: T.string,
      title: T.string,
      desc: T.string,
      en: T.string,
      href: T.string,
      tone: T.string
    }))
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
