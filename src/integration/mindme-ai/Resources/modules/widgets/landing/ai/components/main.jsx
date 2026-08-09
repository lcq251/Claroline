import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {locale} from '#/main/app/intl'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

// className prefix used by the landing stylesheet (see C-8, landing.scss)
const PREFIX = 'claroline-distribution-integration-mindme-ai-landing-ai'

/**
 * Default copy (zh primary + en placeholder, matching the landing design).
 * The real content is seeded in DB by the C-8 updater; these are only
 * fallbacks for freshly created / empty widget instances.
 */
const DEFAULT_CONTENT = {
  zh: {
    title: 'AI,嵌入平台每一处',
    badge: 'AI 基座 + 安全 —— 内置模型接入与数据安全底座',
    items: [
      {
        icon: 'fa fa-fw fa-comments',
        name: 'AI 助教',
        desc: '随时答疑，陪伴式学习'
      },
      {
        icon: 'fa fa-fw fa-check-circle',
        name: '自动批改',
        desc: '主观题智能评分，解放老师'
      },
      {
        icon: 'fa fa-fw fa-bolt',
        name: '内容生成',
        desc: '摘要、测验、学习路径一键生成'
      },
      {
        icon: 'fa fa-fw fa-bullseye',
        name: '智能推荐',
        desc: '个性化学习资源推荐'
      }
    ]
  },
  en: {
    title: 'AI, embedded everywhere in the platform',
    badge: 'AI foundation + Security — built-in model integration, secure by design',
    items: [
      {
        icon: 'fa fa-fw fa-comments',
        name: 'AI Tutor',
        desc: 'Ask anytime, companion-style learning'
      },
      {
        icon: 'fa fa-fw fa-check-circle',
        name: 'Auto-grading',
        desc: 'Smart scoring for subjective answers, freeing teachers'
      },
      {
        icon: 'fa fa-fw fa-bolt',
        name: 'Content generation',
        desc: 'Summaries, quizzes and learning paths in one click'
      },
      {
        icon: 'fa fa-fw fa-bullseye',
        name: 'Smart recommendations',
        desc: 'Personalized learning resources, tailored to each learner'
      }
    ]
  }
}

/**
 * Landing AI widget: AI capability showcase (title + items grid + security badge).
 */
const LandingAi = (props) => {
  const defaults = DEFAULT_CONTENT[locale()] || DEFAULT_CONTENT.zh
  const parameters = props.parameters || {}
  // bilingual seed: the C-8 updater stores the complete English copy under the
  // `en` key; prefer it when the visitor locale matches, fall back to the flat
  // (zh primary, admin-editable) parameters then to the component defaults.
  const localized = parameters[locale()] || {}

  const title = localized.title || parameters.title || defaults.title
  const badge = localized.badge || parameters.badge || defaults.badge
  const items = Array.isArray(localized.items) ? localized.items : (Array.isArray(parameters.items) ? parameters.items : defaults.items)

  return (
    <section className={`landing-widget ${PREFIX}`}>
      <div className={`${PREFIX}-content`}>
        <div className={`${PREFIX}-layout`}>
          <div className={`${PREFIX}-intro`}>
            {badge &&
              <span className={`${PREFIX}-badge`}>{badge}</span>
            }

            {title &&
              <h2 className={`${PREFIX}-title`}>{title}</h2>
            }
          </div>

          <div className={`${PREFIX}-grid`}>
            {items.map((item, index) => {
              if (!item) {
                return null
              }

              return (
                <article key={index} className={`${PREFIX}-item`}>
                  {item.icon &&
                    <span className={`${PREFIX}-icon`} aria-hidden="true">
                      <i className={item.icon} />
                    </span>
                  }
                  {item.name &&
                    <h3 className={`${PREFIX}-name`}>{item.name}</h3>
                  }
                  {item.desc &&
                    <p className={`${PREFIX}-desc`}>{item.desc}</p>
                  }
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

LandingAi.propTypes = {
  parameters: T.shape({
    title: T.string,
    badge: T.string,
    items: T.arrayOf(T.shape({
      icon: T.string,
      name: T.string,
      desc: T.string
    }))
  })
}

const LandingAiContainer = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(LandingAi)

export {
  LandingAiContainer as LandingAi
}
