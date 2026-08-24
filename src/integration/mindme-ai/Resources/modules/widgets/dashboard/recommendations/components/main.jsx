/*
 * dashboard-recommendations: recommended products (priced courses + resources).
 *
 * Rendered as a Claroline list grid (tiles) using the standard DataCard
 * component, aligned with the core list DISPLAY_TILES look (size md / col).
 *
 * data.recommendations[] injected by the backend serializer. Empty list
 * suppresses the widget entirely. Each card exposes a free "enable" action
 * (route B, no payment): clicking it grants the current user access to the
 * product's target; clicking the card body opens the target.
 */

import React, {useState} from 'react'
import {connect, useDispatch} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {selectors as contentSelectors} from '#/main/core/widget/content/store'
import {apiFetch} from '#/main/app/api/fetch'
import {DataCard} from '#/main/app/data/components/card'
import {LINK_BUTTON} from '#/main/app/buttons'

import {BlockHead} from '../../common/block'

const PREFIX = 'mindme-ai-dashboard-dashboard-recommendations-block'

const TYPE_MAP = {
  course: {icon: 'fa fa-fw fa-graduation-cap'},
  resource: {icon: 'fa fa-fw fa-book'},
  template: {icon: 'fa fa-fw fa-th-large'},
}

const RecommendationCard = ({item}) => {
  const dispatch = useDispatch()
  const [opened, setOpened] = useState(false)
  const [enabling, setEnabling] = useState(false)

  const icon = TYPE_MAP[item.type]?.icon || 'fa fa-fw fa-book'

  const enable = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (opened || enabling) {
      return
    }

    setEnabling(true)
    apiFetch({
      url: `/apiv2/product/${item.id}/enable`,
      request: {method: 'POST'}
    }, dispatch)
      .then(() => setOpened(true))
      .catch(() => {})
      .finally(() => setEnabling(false))
  }

  return (
    <li className="data-grid-item">
      <DataCard
        icon={icon}
        name={item.title}
        title={item.title}
        contentText={item.desc}
        size="md"
        orientation="col"
        primaryAction={item.url && '#' !== item.url ? {
          type: LINK_BUTTON,
          target: item.url
        } : undefined}
      >
        <button
          type="button"
          className={`btn btn-sm w-100 ${opened ? 'btn-outline-success' : 'btn-primary'}`}
          disabled={opened || enabling}
          onClick={enable}
        >
          {opened
            ? trans('dashboard_rec_enabled', {}, 'widget')
            : trans('dashboard_rec_enable', {}, 'widget')}
        </button>
      </DataCard>
    </li>
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
      <div className="data-grid data-grid-md data-grid-col">
        <ul className="data-grid-content list-unstyled mb-auto">
          {items.map(item => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </ul>
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
