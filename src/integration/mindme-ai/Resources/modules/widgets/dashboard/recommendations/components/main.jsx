/*
 * dashboard-recommendations: product list (route A — full ListData).
 *
 * Rendered with the standard Claroline ListData component (same as the
 * resource list), fetching /apiv2/product through the Finder. Features:
 *   - top filter bar (filter by type: all / course / resource)
 *   - sorting (free from ListData)
 *   - ProductCard tiles with top-right toolbar + bottom meta + enable button
 */

import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {withReducer} from '#/main/app/store/components/withReducer'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConst} from '#/main/app/content/list/constants'
import {selectors as listSelectors} from '#/main/app/content/list/store/selectors'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {ProductCard} from '#/integration/mindme-ai/widgets/dashboard/recommendations/components/card'
import {reducer, selectors} from '#/integration/mindme-ai/widgets/dashboard/recommendations/store'

import {BlockHead} from '../../common/block'

const PREFIX = 'mindme-ai-dashboard-dashboard-recommendations-block'

// top-right toolbar placeholders (route A: UI only, no real feature)
const cardActions = () => [
  {
    name: 'resource',
    type: CALLBACK_BUTTON,
    icon: 'fa fa-fw fa-book',
    label: trans('dashboard_rec_open_resource', {}, 'widget'),
    callback: () => {},
  },
  {
    name: 'configure',
    type: CALLBACK_BUTTON,
    icon: 'fa fa-fw fa-cog',
    label: trans('dashboard_rec_configure', {}, 'widget'),
    callback: () => {},
  },
  {
    name: 'move-up',
    type: CALLBACK_BUTTON,
    icon: 'fa fa-fw fa-arrow-up',
    label: trans('dashboard_rec_move_up', {}, 'widget'),
    callback: () => {},
  },
  {
    name: 'move-down',
    type: CALLBACK_BUTTON,
    icon: 'fa fa-fw fa-arrow-down',
    label: trans('dashboard_rec_move_down', {}, 'widget'),
    callback: () => {},
  },
]

const RecommendationsComponent = props => {
  // empty list suppresses the widget entirely
  if (props.listLoaded && 0 === props.listTotalResults) {
    return null
  }

  return (
    <section className={PREFIX} aria-label={trans('dashboard-recommendations', {}, 'widget')}>
      <BlockHead
        title={trans('dashboard_block_recommendations', {}, 'widget')}
        en="Recommendations"
      />
      <ListData
        name={selectors.STORE_NAME}
        fetch={{
          url: '/apiv2/product',
          autoload: true
        }}
        definition={[
          {
            name: 'title',
            label: trans('name'),
            type: 'string',
            primary: true,
            displayed: true
          }, {
            name: 'type',
            alias: 'targetType',
            label: trans('dashboard_rec_filter_type', {}, 'widget'),
            type: 'choice',
            filterable: true,
            options: {
              choices: {
                course: trans('dashboard_rec_filter_course', {}, 'widget'),
                resource: trans('dashboard_rec_filter_resource', {}, 'widget'),
              },
              condensed: true
            }
          }, {
            name: 'price',
            label: trans('price'),
            type: 'number',
            sortable: true,
            displayed: true
          }, {
            name: 'status',
            label: trans('status'),
            type: 'string'
          }
        ]}
        card={ProductCard}
        display={{
          current: listConst.DISPLAY_TILES
        }}
        actions={cardActions}
        filterable={true}
        sortable={true}
        paginated={false}
        count={false}
      />
    </section>
  )
}

RecommendationsComponent.propTypes = {
  listLoaded: T.bool,
  listTotalResults: T.number,
}

const RecommendationsBlock = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => {
      const listState = listSelectors.list(state, selectors.STORE_NAME)

      return {
        listLoaded: listState ? listSelectors.loaded(listState) : false,
        listTotalResults: listState ? listSelectors.totalResults(listState) : 0,
      }
    }
  )(RecommendationsComponent)
)

export {
  RecommendationsBlock,
}
