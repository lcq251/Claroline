/*
 * dashboard-shortcuts widget (C-22): quick-access tiles.
 *
 * items[] come from the widget parameters (admin-configured, default 4
 * routes). Empty items -> the whole block is hidden (spec §3.6).
 */

import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

import {BlockHead} from '../../common/block'

const PREFIX = 'claroline-distribution-integration-mindme-ai-dashboard-dashboard-shortcuts'

const ShortcutsComponent = props => {
  const parameters = props.parameters || {}
  const items = Array.isArray(parameters.items) ? parameters.items : []

  // empty items -> the whole block is hidden (spec §3.6)
  if (0 === items.length) {
    return null
  }

  return (
    <section className={PREFIX} aria-label={trans('dashboard_block_shortcuts', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_block_shortcuts', {}, 'widget')}
        en="Shortcuts"
      />

      <div className="quick-grid">
        {items.map((item, index) => (
          <a
            key={item.label || index}
            className="quick-tile"
            href={item.url || '#'}
          >
            <span className="qt-ico" aria-hidden="true"><i className={item.icon || 'fa fa-fw fa-link'} /></span>
            <span className="qt-text">
              <span className="qt-name">{item.label}</span>
              {item.en &&
                <span className="qt-sub">{item.en}</span>
              }
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

ShortcutsComponent.propTypes = {
  parameters: T.shape({
    items: T.arrayOf(T.shape({
      label: T.string,
      en: T.string,
      icon: T.string,
      url: T.string
    }))
  })
}

const Shortcuts = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(ShortcutsComponent)

export {
  Shortcuts
}
