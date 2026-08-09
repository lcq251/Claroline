import React from 'react'
import {PropTypes as T} from 'prop-types'

import {locale} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {sanitizeHref} from '#/plugin/home/home/widgets/landing/sanitize'

// className prefix used by the landing stylesheet (see C-8, landing.scss)
const PREFIX = 'claroline-distribution-plugin-home-landing-hero'

// Default hero background: B3 深青海报 (C-11 拍板, design doc §1). Applied by
// the component so the "empty parameter → default gradient" behaviour lives
// here (the stylesheet only keeps a solid fallback while styles load).
const DEFAULT_BACKGROUND = 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)'

/**
 * Default copy (zh primary + en block).
 * The real content is seeded in DB by the C-8 updater (C-11 updated the seed);
 * these are only fallbacks for freshly created / empty widget instances.
 *
 * C-11 极简聚焦型 hero: the `title` parameter stores the complete equation
 * string ("AI = 协同 + 伙伴") and the component splits it into the five
 * equation tokens (E1 单色层级: AI 微放大, = / + 符号弱化). Only the four
 * first-screen elements are rendered — topbar (brand + year stamp), equation
 * title, subtitle and the single CTA. story / quote / visuals / wechat /
 * stamp are no longer rendered (params stay backward compatible with older
 * widget data, they are just ignored).
 */
const DEFAULT_CONTENT = {
  zh: {
    title: 'AI = 协同 + 伙伴',
    subtitle: '用AI学AI，让学习多一点DIY',
    cta: {
      label: '登录 / 注册',
      href: '/login'
    },
    brand: '澜之轩 · Claroline',
    year: '2026 · AI 元年'
  },
  en: {
    title: 'AI = Collaboration + Companion',
    subtitle: 'Learn AI with AI — make learning more DIY',
    cta: {
      label: 'Sign In / Register',
      href: '/login'
    },
    brand: '澜之轩 · Claroline',
    year: '2026 · Year of AI'
  }
}

/**
 * Splits the equation title into tokens ("AI" / "=" / word / "+" / word).
 *
 * The `title` parameter stores the complete string (e.g. "AI = 协同 + 伙伴"),
 * the component renders it as a flex row of spans: the "AI" token is slightly
 * enlarged (E1 visual anchor), the "=" / "+" operators are de-emphasized
 * (lighter weight, smaller size, faded colour — `.mh-op`).
 *
 * A plain title without operators renders as a single word token, so older
 * widget data stays compatible.
 *
 * @param {string} title
 * @return {Array} [{type: 'ai'|'op'|'word', value, key}]
 */
function splitEquation(title) {
  const parts = String(title).split(/(\s*[=+]\s*)/)

  return parts
    .filter((part) => '' !== part.trim())
    .map((part, index) => {
      const value = part.trim()

      if ('=' === value || '+' === value) {
        return {type: 'op', value, key: index}
      }

      if ('AI' === value) {
        return {type: 'ai', value, key: index}
      }

      return {type: 'word', value, key: index}
    })
}

/**
 * Landing hero widget (C-11 极简聚焦型): poster-style first screen with a
 * top bar (brand + 2026 year stamp), a centered equation headline, a subtitle
 * and a single CTA. Background B3 深青海报, whole section inverted (white).
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
  const brand = localized.brand || parameters.brand || defaults.brand
  const year = localized.year || parameters.year || defaults.year

  // single CTA: accept both the legacy array shape (v2 seed: [{label, href}])
  // and the C-11 single-object shape ({label, href}); render the first entry
  const rawCta = localized.cta || parameters.cta || defaults.cta
  const cta = Array.isArray(rawCta) ?
    (rawCta.find((item) => item && item.href) || rawCta[0] || null) :
    rawCta

  const align = parameters.align || 'center'

  // background: default B3 deep-teal gradient, or an explicit CSS gradient
  // (linear-gradient / radial-gradient), a color value (hex/rgb/hsl...),
  // or an image URL (v2 gradient support, D-3 §1).
  const rootStyle = {backgroundImage: DEFAULT_BACKGROUND}
  if (parameters.background) {
    const background = String(parameters.background).trim()
    if (/^(linear-gradient\(|radial-gradient\()/i.test(background)) {
      // a CSS gradient is used as-is (as background-image)
      rootStyle.backgroundImage = background
    } else if (/^(#|rgb\(|rgba\(|hsl\(|hsla\(|hwb\()/i.test(background)) {
      // a plain color value; drop the default gradient so the color applies
      rootStyle.backgroundColor = background
      rootStyle.backgroundImage = 'none'
    } else {
      // image URL, assigned through the CSSOM (style attribute), so it cannot
      // break out of the background-image declaration
      rootStyle.backgroundImage = `url("${background}")`
    }
  }

  return (
    <section
      className={`landing-widget ${PREFIX} ${PREFIX}-align-${align}`}
      style={rootStyle}
    >
      <div className={`${PREFIX}-container`}>
        <header className={`${PREFIX}-topbar hero-fade`} style={{'--d': '0ms'}}>
          <span className={`${PREFIX}-brand`}>{brand}</span>
          <span className={`${PREFIX}-year`}>{year}</span>
        </header>

        <div className={`${PREFIX}-main`}>
          {title &&
            <h1 className={`${PREFIX}-title hero-fade`} style={{'--d': '100ms'}}>
              {splitEquation(title).map((token) => (
                <span key={token.key} className={`mh-${token.type}`}>{token.value}</span>
              ))}
            </h1>
          }

          {subtitle &&
            <p className={`${PREFIX}-subtitle hero-fade`} style={{'--d': '200ms'}}>{subtitle}</p>
          }

          {cta && cta.href &&
            <Button
              type={LINK_BUTTON}
              className={`${PREFIX}-cta btn btn-primary hero-fade`}
              style={{'--d': '300ms'}}
              target={sanitizeHref(cta.href)}
              label={cta.label}
            />
          }
        </div>
      </div>
    </section>
  )
}

LandingHero.propTypes = {
  parameters: T.shape({
    title: T.string,
    subtitle: T.string,
    // single CTA: {label, href} (C-11) — legacy array shape still accepted
    cta: T.oneOfType([
      T.shape({
        label: T.string,
        href: T.string
      }),
      T.arrayOf(T.shape({
        label: T.string,
        href: T.string
      }))
    ]),
    brand: T.string,
    year: T.string,
    background: T.string,
    align: T.oneOf(['left', 'center', 'right']),
    // complete English copy (rendered by the hero component for en visitors)
    en: T.shape({
      title: T.string,
      subtitle: T.string,
      cta: T.oneOfType([
        T.shape({
          label: T.string,
          href: T.string
        }),
        T.arrayOf(T.shape({
          label: T.string,
          href: T.string
        }))
      ]),
      brand: T.string,
      year: T.string
    })
  })
}

export {
  LandingHero
}
