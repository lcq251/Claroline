/*
 * dashboard-recommendations: recommended products (priced courses + resources).
 *
 * Vertical cards aligned with the dashboard card visual language (B teal).
 * data.recommendations[] injected by the backend serializer. Empty list
 * suppresses the widget entirely (graceful, same as workspace-tree).
 */

import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'

import {BlockHead} from '../../common/block'

const PREFIX = 'mindme-ai-dashboard-dashboard-recommendations-block'

const TYPE_MAP = {
  course: {icon: 'fa fa-fw fa-graduation-cap', tag: 'course'},
  resource: {icon: 'fa fa-fw fa-book', tag: 'resource'},
  template: {icon: 'fa fa-fw fa-th-large', tag: 'template'},
}

const RecommendationCard = ({item}) => {
  const icon = TYPE_MAP[item.type]?.icon || 'fa fa-fw fa-book'
  const tagLabel = TYPE_MAP[item.type]?.tag ? trans('dashboard_rec_tag_' + item.type, {}, 'widget') : ''

  return (
    <a className={`${PREFIX}-card`} href={item.url || '#'}>
      <div className={`${PREFIX}-cover`}>
        <span className={icon} />
      </div>
      <div className={`${PREFIX}-body`}>
        {tagLabel && (
          <span className={`${PREFIX}-tag`}>{tagLabel}</span>
        )}
        <div className={`${PREFIX}-title`}>{item.title || ''}</div>
        {item.desc && <p className={`${PREFIX}-desc`}>{item.desc}</p>}
        <span className={`${PREFIX}-more`}>
          {trans('dashboard_more_recommendations', {}, 'widget')}
        </span>
      </div>
    </a>
  )
}

RecommendationCard.propTypes = {
  item: T.shape({
    id: T.string,
    type: T.string,
    title: T.string,
    desc: T.string,
    url: T.string,
  }).isRequired,
}

const RecommendationsComponent = props => {
  const parameters = props.parameters || {}
  const data = parameters.data || {}
  const items = Array.isArray(data.recommendations) && data.recommendations.length ? data.recommendations : (parameters.recommendations ?? [])

  // empty list suppresses the widget entirely
  if (0 === items.length) {
    return null
  }

  return (
    <section className={PREFIX} aria-label={trans('dashboard-recommendations', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_block_recommendations', {}, 'widget')}
        en="Recommendations"
      />
      <div className={`${PREFIX}-grid`}>
        {items.map(item => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

RecommendationsComponent.propTypes = {
  parameters: T.shape({
    data: T.shape({
      recommendations: T.arrayOf(T.shape({
        id: T.string,
        type: T.string,
        title: T.string,
        desc: T.string,
        url: T.string,
      })),
    }),
  }),
}

const RecommendationsBlock = connect(
  (state) => ({
    parameters: contentSelectors.parameters(state),
  })
)(RecommendationsComponent)

export {
  RecommendationsBlock,
}