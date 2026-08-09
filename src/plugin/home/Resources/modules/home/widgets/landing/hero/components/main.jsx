import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {locale} from '#/main/app/intl'
import {Html} from '#/main/app/components/html'
import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {sanitizeHref} from '#/plugin/home/home/widgets/landing/sanitize'

// className prefix used by the landing stylesheet (see C-8, landing.scss)
const PREFIX = 'claroline-distribution-plugin-home-landing-hero'

// The seal stamp text is a cultural symbol: it stays Chinese on both locales.
const DEFAULT_STAMP_TEXT = '澜之轩工作室'

// Default hero background: G1 浅青水洗 gradient (D-3 定稿). Applied by the
// component so the "empty parameter → default gradient" behaviour lives here
// (the stylesheet only keeps a solid fallback while styles load).
const DEFAULT_BACKGROUND = 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 46%, #f8fafc 100%)'

// Default WeChat scan-to-login module values (D-3 §3.2 / §3.3).
// The QR placeholder image is hosted by the mindme-ai bundle and published
// through assets:install (see the C-10 seed for the full parameter tree).
const DEFAULT_WECHAT = {
  title: '微信扫码登录',
  hint: '打开微信扫一扫，即可登录体验 · 请使用手机微信扫描',
  image: '/bundles/clarolinemindmeai/images/wechat-qr.png'
}

/**
 * Default copy (zh + en placeholders).
 * The real content is seeded in DB by the C-8 updater; these are only
 * fallbacks for freshly created / empty widget instances.
 *
 * v2 (C-10): new headline, the user's original narrative (open ending kept),
 * no more quote block (the narrative itself opens with "有人称为 AI 元年").
 * The story keeps the `.em` / `.em-hook` highlight spans seeded by the C-10
 * updater (D-3 §2.3 — keyword restraint: only the anchor sentence and the
 * open-ending hook are marked).
 */
const DEFAULT_CONTENT = {
  zh: {
    title: '用AI学AI，让学习路上多一个陪伴',
    subtitle: '源自教学的 AI 学习平台 —— 老师工具 · 学生学习方法 · AI 嵌入式平台',
    story: '<p>2026 年，有人称为<span class="em">AI 元年</span>。国际竞争、资本推动，将使 AI 发展越来越快，AI 会越来越具备人的特征。未来，AI 将替代人大部分工作，而人将通过 AI 工作、生活、社交，将成为常态。<span class="em-hook">我们对待 AI 的态度……</span></p>',
    cta: [
      {label: '登录', href: '/login'},
      {label: '注册', href: '/registration'}
    ]
  },
  en: {
    title: 'Learn AI with AI — one more companion on your learning journey.',
    subtitle: 'An AI learning platform born from teaching — teacher tools · student learning · AI-embedded platform.',
    story: '<p>2026 — some call it the Year of AI. Driven by international competition and capital, AI will advance faster and faster, growing ever more human-like. In the future, AI will take over most of human work, and working, living, and socializing through AI will become the norm. <span class="em-hook">Our attitude toward AI…</span></p>',
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
 * Highlights the design keywords inside the (zh) title: "AI" (×2) and "陪伴".
 *
 * Each occurrence is wrapped in a `.hl` span whose ::after pseudo-element draws
 * the accent-soft marker under the glyphs — the only scheme that does not clash
 * with the title's background-clip:text gradient (D-3 §2.3).
 *
 * @param {string} title
 * @return {Array} the title as React children
 */
function highlightTitle(title) {
  return String(title)
    .split(/(AI|陪伴)/g)
    .map((part, index) => (
      -1 !== ['AI', '陪伴'].indexOf(part) ?
        <span key={index} className="hl">{part}</span> :
        part
    ))
}

/**
 * Landing hero widget: first-screen visual + AI 元年 narrative + seal stamp
 * + WeChat scan-to-login module.
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
  // visual infographic strip (D-2 / Plan 05): when `visuals` is configured the
  // narrative is rendered as a horizontal three-column icon strip (icon +
  // short title + one-line description) instead of the rich-text `story`
  // paragraph. When no visuals are configured the strip is skipped and the
  // `story` fallback is rendered — backward compatible with already-deployed
  // widget instances (their parameters carry no `visuals` key).
  const visuals = Array.isArray(localized.visuals) ? localized.visuals : (Array.isArray(parameters.visuals) ? parameters.visuals : null)
  const showVisuals = !isEmpty(visuals)
  const cta = Array.isArray(localized.cta) ? localized.cta : (Array.isArray(parameters.cta) ? parameters.cta : defaults.cta)
  const align = parameters.align || 'center'

  // background: default G1 gradient, or an explicit CSS gradient
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

  // seal stamp (top-right corner, flat design, styled by landing.scss)
  const stampEnabled = undefined === get(parameters, 'stamp.enabled') || get(parameters, 'stamp.enabled')
  const stampText = get(parameters, 'stamp.text') || DEFAULT_STAMP_TEXT
  const stampColumns = splitStampText(stampText)

  // WeChat scan-to-login module (CTA 下方, D-3 §3): renders only when a
  // `wechat` parameter block exists and is not explicitly disabled.
  //
  // OAuth extension point (D-3 §3.4): this is display-only today. When a real
  // WeChat OAuth integration lands, extend the parameter tree with
  // `wechat.oauth.{appId, redirectUri, scope}` (the secret stays server-side,
  // never in the widget parameters) and upgrade the interaction from
  // "scan to view" to "scan to authorize".
  const wechat = get(parameters, 'wechat')
  const wechatEnabled = wechat && (undefined === get(wechat, 'enabled') || get(wechat, 'enabled'))
  const wechatLocalized = wechat && 'en' === locale() ? get(wechat, 'en') : null
  const wechatTitle = get(wechatLocalized, 'title') || get(wechat, 'title') || DEFAULT_WECHAT.title
  const wechatHint = get(wechatLocalized, 'hint') || get(wechat, 'hint') || DEFAULT_WECHAT.hint
  const wechatImage = sanitizeHref(get(wechat, 'image') || DEFAULT_WECHAT.image)

  // the en title renders as plain text (no keyword markers, D-3 §6); the zh /
  // default title gets the AI / 陪伴 highlight markers
  const markKeywords = !localized.title

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
          <h1 className={`${PREFIX}-title hero-fade`} style={{'--d': '160ms'}}>
            {markKeywords ? highlightTitle(title) : title}
          </h1>
        }

        {subtitle &&
          <p className={`${PREFIX}-subtitle hero-fade`} style={{'--d': '260ms'}}>{subtitle}</p>
        }

        {showVisuals ?
          <div className={`${PREFIX}-visuals hero-fade`} style={{'--d': '360ms'}}>
            {visuals.map((item, index) => {
              if (!item) {
                return null
              }

              // a single visual entry may carry several FontAwesome classes
              // (space-separated, e.g. "fa-industry fa-plane fa-car") — each
              // one is rendered as its own icon (D-2 spec row 02)
              const icons = String(item.icon || '')
                .trim()
                .split(/\s+/)
                .filter((icon) => icon && 'fa' !== icon && 'fa-fw' !== icon)

              return (
                <div key={index} className={`${PREFIX}-visual`}>
                  {0 !== icons.length &&
                    <div className={`${PREFIX}-visual-icons`} aria-hidden="true">
                      {icons.map((icon, iconIndex) =>
                        <i key={iconIndex} className={`fa fa-fw ${icon}`} />
                      )}
                    </div>
                  }
                  {item.title &&
                    <h3 className={`${PREFIX}-visual-title`}>{item.title}</h3>
                  }
                  {item.desc &&
                    <p className={`${PREFIX}-visual-desc`}>{item.desc}</p>
                  }
                </div>
              )
            })}
          </div>
          :
          story &&
            <Html className={`${PREFIX}-story hero-fade`} style={{'--d': '360ms'}}>{story}</Html>
        }

        {!isEmpty(cta) &&
          <div className={`${PREFIX}-ctas hero-fade`} style={{'--d': '460ms'}}>
            {cta.map((item, index) => {
              if (!item) {
                return null
              }

              return (
                <Button
                  key={index}
                  type={LINK_BUTTON}
                  className={`${PREFIX}-cta btn btn-primary`}
                  target={sanitizeHref(item.href)}
                  label={item.label}
                />
              )
            })}
          </div>
        }

        {wechatEnabled && wechatImage &&
          <div className={`${PREFIX}-qr hero-fade`} style={{'--d': '560ms'}}>
            <div className={`${PREFIX}-qr-code`} role="img" aria-label={wechatTitle}>
              {/* placeholder that shows while the QR image loads / after a failure */}
              <svg className="qr-fallback" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="120" height="120" rx="8" fill="#f1f5f9"/>
                <rect x="10" y="10" width="26" height="26" fill="#cbd5e1"/>
                <rect x="16" y="16" width="14" height="14" fill="#f1f5f9"/>
                <rect x="84" y="10" width="26" height="26" fill="#cbd5e1"/>
                <rect x="84" y="16" width="14" height="14" fill="#f1f5f9"/>
                <rect x="10" y="84" width="26" height="26" fill="#cbd5e1"/>
                <rect x="16" y="84" width="14" height="14" fill="#f1f5f9"/>
                <text x="60" y="56" textAnchor="middle" fontSize="11" fontWeight="600" fill="#94a3b8" fontFamily="system-ui, sans-serif">二维码待上传</text>
                <text x="60" y="70" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#94a3b8" fontFamily="system-ui, sans-serif">QR CODE PENDING</text>
              </svg>
              {/* real QR image; on failure it is removed so the placeholder shows */}
              <img
                className="qr-img"
                src={wechatImage}
                alt={wechatTitle}
                onError={(event) => event.currentTarget.remove()}
              />
            </div>
            <div className={`${PREFIX}-qr-info`}>
              <p className={`${PREFIX}-qr-title`}>
                <i className="fa-brands fa-weixin" aria-hidden="true" />
                <span>{wechatTitle}</span>
              </p>
              {wechatHint &&
                <p className={`${PREFIX}-qr-hint`}>{wechatHint}</p>
              }
            </div>
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
    cta: T.arrayOf(T.shape({
      label: T.string,
      href: T.string
    })),
    // visual infographic strip (D-2 / Plan 05): replaces `story` when configured
    visuals: T.arrayOf(T.shape({
      icon: T.string,
      title: T.string,
      desc: T.string
    })),
    background: T.string,
    align: T.oneOf(['left', 'center', 'right']),
    stamp: T.shape({
      enabled: T.bool,
      text: T.string
    }),
    wechat: T.shape({
      enabled: T.bool,
      image: T.string,
      title: T.string,
      hint: T.string,
      // OAuth extension point (D-3 §3.4): wechat.oauth.{appId, redirectUri, scope}
      en: T.shape({
        title: T.string,
        hint: T.string
      })
    })
  })
}

export {
  LandingHero
}
