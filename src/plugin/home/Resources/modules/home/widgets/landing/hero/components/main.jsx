import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {locale} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'

// className prefix used by the landing stylesheet (see C-8, landing.less)
const PREFIX = 'claroline-distribution-plugin-home-landing-hero'

// The seal stamp text is a cultural symbol: it stays Chinese on both locales.
const DEFAULT_STAMP_TEXT = '澜之轩工作室'

/**
 * Default copy (zh + en placeholders).
 * The real content is seeded in DB by the C-8 updater; these are only
 * fallbacks for freshly created / empty widget instances.
 */
const DEFAULT_CONTENT = {
  zh: {
    title: '用AI、学AI，学习路上多一个陪伴',
    subtitle: '2026 AI 元年 · AI 堪比火与工具 · 学会使用 AI，掌握与 AI 交互的技能',
    story: '<p>2026 是 AI 元年。AI 堪比古人掌握火与工具——它将改变人类工作的方式：无人工厂、无人机、无人驾驶相继成为现实。</p><p>人与社会的交互越来越多地经由 AI 发生，而 AI 已具备类人的性质。正因如此，学会使用 AI，成了这个时代每个人的必修课。</p>',
    quote: '2026，AI 元年。',
    cta: [
      {label: '登录', href: '/login'},
      {label: '注册', href: '/registration'}
    ]
  },
  en: {
    title: 'Learn AI. Use AI. Your companion on the learning journey.',
    subtitle: '2026, the Year of AI · AI rivals fire and tools · Learn to use AI, master the skills to interact with it',
    story: '<p>2026 marks the Year of AI. Just as our ancestors mastered fire and tools, AI is reshaping how we work — automated factories, drones and driverless vehicles are becoming reality.</p><p>Human interaction with society increasingly happens through AI, which now exhibits human-like qualities. That is why learning to use AI has become an essential lesson for everyone in this era.</p>',
    quote: '2026, the Year of AI.',
    cta: [
      {label: 'Login', href: '/login'},
      {label: 'Register', href: '/registration'}
    ]
  }
}

/**
 * Splits the seal stamp text into two vertical columns.
 * Default 6-char text becomes 3 + 3 (澜之轩 / 工作室).
 *
 * @param {string} text
 * @return {string[]}
 */
function splitStampText(text) {
  const value = String(text || '').trim()
  if (!value) {
    return []
  }

  const half = Math.ceil(value.length / 2)

  return [value.slice(0, half), value.slice(half)]
}

/**
 * Landing hero widget: first-screen visual + AI 元年 narrative + seal stamp.
 */
const LandingHero = (props) => {
  const defaults = DEFAULT_CONTENT[locale()] || DEFAULT_CONTENT.zh
  const parameters = props.parameters || {}
  // bilingual seed: the C-8 updater stores the complete English copy under the
  // `en` key; prefer it when the visitor locale matches, fall back to the flat
  // (zh primary, admin-editable) parameters then to the component defaults.
  const localized = parameters[locale()] || {}

  const title = localized.title || parameters.title || defaults.title
  const subtitle = localized.subtitle || parameters.subtitle || defaults.subtitle
  // NB. `story` is rich HTML. It is rendered through the platform `Html`
  // component (same as the simple widget) and is sanitized by the HTML editor
  // on save; never interpolate it as raw JSX text.
  const story = localized.story || parameters.story || defaults.story
  const quote = localized.quote || parameters.quote || defaults.quote
  const cta = !isEmpty(localized.cta) ? localized.cta : (isEmpty(parameters.cta) ? defaults.cta : parameters.cta)
  const align = parameters.align || 'center'

  // background: a color value (hex/rgb/hsl...) or an image URL
  const rootStyle = {}
  if (parameters.background) {
    const background = String(parameters.background).trim()
    if (/^(#|rgb\(|rgba\(|hsl\(|hsla\(|hwb\()/i.test(background)) {
      rootStyle.backgroundColor = background
    } else {
      // assigned through the CSSOM (style attribute), so it cannot break out
      // of the background-image declaration
      rootStyle.backgroundImage = `url("${background}")`
    }
  }

  // seal stamp (top-right corner, flat design, styled by landing.less)
  const stampEnabled = undefined === get(parameters, 'stamp.enabled') || get(parameters, 'stamp.enabled')
  const stampText = get(parameters, 'stamp.text') || DEFAULT_STAMP_TEXT
  const stampColumns = splitStampText(stampText)

  return (
    <section
      className={`landing-widget ${PREFIX} ${PREFIX}-align-${align}`}
      style={rootStyle}
    >
      {stampEnabled && 0 !== stampColumns.length &&
        <div className={`${PREFIX}-stamp`} role="note" aria-label={stampText}>
          {stampColumns.map((column, index) =>
            <span key={index} className={`${PREFIX}-stamp-column`}>{column}</span>
          )}
        </div>
      }

      <div className={`${PREFIX}-content`}>
        {title &&
          <h1 className={`${PREFIX}-title`}>{title}</h1>
        }

        {subtitle &&
          <p className={`${PREFIX}-subtitle`}>{subtitle}</p>
        }

        {story &&
          <Html className={`${PREFIX}-story`}>{story}</Html>
        }

        {quote &&
          <blockquote className={`${PREFIX}-quote`}>
            <p>{quote}</p>
          </blockquote>
        }

        {!isEmpty(cta) &&
          <div className={`${PREFIX}-ctas`}>
            {cta.map((item, index) => {
              if (!item) {
                return null
              }

              return (
                <Button
                  key={index}
                  type={LINK_BUTTON}
                  className={`${PREFIX}-cta btn btn-primary`}
                  target={item.href}
                  label={item.label}
                />
              )
            })}
          </div>
        }
      </div>
    </section>
  )
}

LandingHero.propTypes = {
  parameters: T.shape({
    title: T.string,
    subtitle: T.string,
    story: T.string,
    quote: T.string,
    cta: T.arrayOf(T.shape({
      label: T.string,
      href: T.string
    })),
    background: T.string,
    align: T.oneOf(['left', 'center', 'right']),
    stamp: T.shape({
      enabled: T.bool,
      text: T.string
    })
  })
}

export {
  LandingHero
}
