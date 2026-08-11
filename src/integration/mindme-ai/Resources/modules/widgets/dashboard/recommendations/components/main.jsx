/*
 * dashboard-recommendations widget (C-22): hand-picked recommendation cards.
 *
 * D10: the 3-column grid became a horizontal scroll rail (board StatRail
 * pattern): `.rec-grid` is a flex overflow-x container, cards are fixed
 * 240px (220px mobile) with scroll-snap. v1 is human picks only (U2):
 * items[] come from the widget parameters (admin-configured), the like count
 * is a hard-coded 0 placeholder (showLikes controls visibility). No like
 * interaction is implemented.
 */

import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {locale} from '#/main/app/intl'
import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

import {BlockHead} from '../../common/block'
import {getIcon} from '../../common/icons'

const PREFIX = 'claroline-distribution-integration-mindme-ai-dashboard-dashboard-recommendations'

// bilingual item copy (C-8): prefer the `en` key for en visitors, fall back
// to the flat (zh primary) fields
const localized = (item, field) => {
  if ('en' === locale() && item.en && null != item.en[field]) {
    return item.en[field]
  }

  return item[field]
}

const RecommendationCard = props => {
  const item = props.item || {}
  const type = item.type || 'resource'
  const tag = item.tag || null
  const icon = item.icon || getIcon(`rec-${type}`)

  return (
    <article className="rec-card">
      {item.cover
        ? <div className="rec-cover" style={{backgroundImage: `url(${item.cover})`}} />
        : <div className="rec-cover" aria-hidden="true"><i className={`fas ${icon}`} /></div>
      }

      <div className="rec-body">
        <div className="rec-tags">
          <span className="rec-tag">{trans(`dashboard_rec_type_${type}`, {}, 'widget')}</span>
          {tag &&
            <span className="rec-tag rec-tag--human">{trans(`dashboard_rec_tag_${tag}`, {}, 'widget')}</span>
          }
        </div>

        <div className="rec-title">{localized(item, 'title')}</div>
        {localized(item, 'desc') &&
          <div className="rec-desc">{localized(item, 'desc')}</div>
        }

        <div className="rec-foot">
          <span className="who">
            {item.by}
            {item.when && ` · ${item.when}`}
          </span>
          {props.showLikes &&
            <span className="likes">{trans('dashboard_likes', {count: item.likes || 0}, 'widget')}</span>
          }
          {item.url &&
            <a className="go" href={item.url}>{trans('dashboard_go_view', {}, 'widget')}</a>
          }
        </div>
      </div>
    </article>
  )
}

RecommendationCard.propTypes = {
  item: T.shape({
    title: T.string,
    desc: T.string,
    cover: T.string,
    icon: T.string,
    type: T.string,
    tag: T.string,
    by: T.string,
    when: T.string,
    likes: T.number,
    url: T.string,
    en: T.object
  }),
  showLikes: T.bool
}

const RecommendationsComponent = props => {
  const parameters = props.parameters || {}
  const items = Array.isArray(parameters.items) ? parameters.items : []

  // empty items -> the whole block is hidden (spec §3.6)
  if (0 === items.length) {
    return null
  }

  const showLikes = parameters.showLikes !== false

  return (
    <section className={PREFIX} aria-label={trans('dashboard_block_recommendations', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_block_recommendations', {}, 'widget')}
        en="Recommendations"
        more={{label: trans('dashboard_more_recommendations', {}, 'widget'), url: '#/desktop/resources'}}
      />

      <div
        className="rec-grid"
        role="region"
        aria-label={trans('dashboard_block_recommendations', {}, 'widget')}
        tabIndex={0}
      >
        {items.map((item, index) => (
          <RecommendationCard key={item.id || index} item={item} showLikes={showLikes} />
        ))}
      </div>
    </section>
  )
}

RecommendationsComponent.propTypes = {
  parameters: T.shape({
    showLikes: T.bool,
    items: T.arrayOf(T.object)
  })
}

const Recommendations = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state)
  })
)(RecommendationsComponent)

export {
  Recommendations
}
