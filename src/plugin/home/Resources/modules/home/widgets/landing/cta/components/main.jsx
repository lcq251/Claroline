import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {locale} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'

// className prefix used by the landing stylesheet (see C-8, landing.less)
const PREFIX = 'claroline-distribution-plugin-home-landing-cta'

/**
 * Default copy (zh + en placeholders).
 * The real content is seeded in DB by the C-8 updater; these are only
 * fallbacks for freshly created / empty widget instances.
 *
 * CTA constraint (user approved): the block only offers login/register
 * entries — no GitHub / demo / download links. Default hrefs point to the
 * platform login / registration routes.
 */
const DEFAULT_CONTENT = {
  zh: {
    title: '学习路上，多一个 AI 伴侣',
    subtitle: '为老师提供工具，为学生提供方法，为学校提供 AI 嵌入式平台',
    buttons: [
      {label: '登录 / 注册', href: '/login', primary: true}
    ]
  },
  en: {
    title: 'One more AI companion on your learning journey',
    subtitle: 'Tools for teachers, methods for students, an AI-embedded platform for schools.',
    buttons: [
      {label: 'Log in / Register', href: '/login', primary: true}
    ]
  }
}

/**
 * Landing CTA widget: call-to-action block (login / register only).
 */
const LandingCta = (props) => {
  const defaults = DEFAULT_CONTENT[locale()] || DEFAULT_CONTENT.zh
  const parameters = props.parameters || {}

  const title = parameters.title || defaults.title
  const subtitle = parameters.subtitle || defaults.subtitle
  const buttons = isEmpty(parameters.buttons) ? defaults.buttons : parameters.buttons

  return (
    <section className={`landing-widget ${PREFIX}`}>
      <div className={`${PREFIX}-content`}>
        {title &&
          <h2 className={`${PREFIX}-title`}>{title}</h2>
        }

        {subtitle &&
          <p className={`${PREFIX}-subtitle`}>{subtitle}</p>
        }

        {!isEmpty(buttons) &&
          <div className={`${PREFIX}-buttons`}>
            {buttons.map((button, index) => {
              if (!button) {
                return null
              }

              return (
                <Button
                  key={index}
                  type={LINK_BUTTON}
                  className={`${PREFIX}-button ${PREFIX}-button-${button.primary ? 'primary' : 'secondary'} ${button.primary ? 'btn btn-primary' : 'btn btn-outline-primary'}`}
                  target={button.href}
                  label={button.label}
                />
              )
            })}
          </div>
        }
      </div>
    </section>
  )
}

LandingCta.propTypes = {
  parameters: T.shape({
    title: T.string,
    subtitle: T.string,
    buttons: T.arrayOf(T.shape({
      label: T.string,
      href: T.string,
      primary: T.bool
    }))
  })
}

export {
  LandingCta
}
