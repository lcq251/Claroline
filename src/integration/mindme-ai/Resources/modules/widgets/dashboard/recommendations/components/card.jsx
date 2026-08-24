/*
 * ProductCard — DataCard wrapper for the dashboard-recommendations list.
 *
 * Aligns with the resource list card shape:
 *   - contentText   = product description (bottom)
 *   - meta          = type badge + price badge (bottom, like resource meta)
 *   - actions       = top-right toolbar (resource / configure / move-up / move-down)
 *   - children      = bottom-right "enable" small button
 *
 * The top-right actions are UI placeholders only (route A / no-op callbacks);
 * the "enable" button keeps the real /apiv2/product/{id}/enable call.
 */

import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {apiFetch} from '#/main/app/api/fetch'
import {DataCard} from '#/main/app/data/components/card'
import {Badge} from '#/main/app/components/badge'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const TYPE_MAP = {
  course: {icon: 'fa fa-fw fa-graduation-cap'},
  resource: {icon: 'fa fa-fw fa-book'},
  template: {icon: 'fa fa-fw fa-th-large'},
}

const ProductCard = props => {
  const dispatch = useDispatch()
  const [opened, setOpened] = useState(false)
  const [enabling, setEnabling] = useState(false)

  const type = props.data.type || props.data.targetType || 'resource'
  const icon = TYPE_MAP[type]?.icon || 'fa fa-fw fa-book'

  const enable = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (opened || enabling) {
      return
    }

    setEnabling(true)
    apiFetch({
      url: `/apiv2/product/${props.data.id}/enable`,
      request: {method: 'POST'}
    }, dispatch)
      .then(() => setOpened(true))
      .catch(() => {})
      .finally(() => setEnabling(false))
  }

  return (
    <DataCard
      {...props}
      icon={icon}
      name={props.data.title}
      title={props.data.title}
      toolbar="resource more"
      contentText={props.data.description || <em className="text-body-tertiary">{trans('no_description')}</em>}
      meta={
        <>
          <Badge variant="secondary" subtle={true}>{trans('dashboard_rec_tag_' + type, {}, 'widget')}</Badge>
          {null !== props.data.price && undefined !== props.data.price &&
            <Badge variant="secondary" subtle={true}>
              {0 === props.data.price
                ? trans('dashboard_rec_free', {}, 'widget')
                : '¥' + props.data.price}
            </Badge>
          }
        </>
      }
    >
      <div className="d-flex justify-content-end mt-auto" role="presentation">
        <button
          type="button"
          className={`btn btn-sm ${opened ? 'btn-outline-success' : 'btn-primary'}`}
          disabled={opened || enabling}
          onClick={enable}
        >
          {opened
            ? trans('dashboard_rec_enabled', {}, 'widget')
            : trans('dashboard_rec_enable', {}, 'widget')}
        </button>
      </div>
    </DataCard>
  )
}

ProductCard.propTypes = {
  data: T.shape({
    id: T.string,
    type: T.string,
    targetType: T.string,
    title: T.string,
    description: T.string,
    price: T.number,
  }).isRequired,
}

export {
  ProductCard
}
