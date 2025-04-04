import React from 'react'
import fill from 'lodash/fill'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Checkbox} from '#/main/app/input/components/checkbox'

import {DataListView} from '#/main/app/content/list/prop-types'
import {
  getPrimaryAction,
  getActions,
  getSortableProps,
  isRowSelected
} from '#/main/app/content/list/utils'
import {ListBulkActions} from '#/main/app/content/list/components/actions'

import {GridItem} from '#/main/app/content/list/grid/components/item'
import {GridSort} from '#/main/app/content/list/grid/components/sort'

const GridData = props => {
  let bulkActions = []
  if (props.selection && 0 < props.selection.current.length) {
    bulkActions = getActions(
      props.selection.current.map(id => props.data.find(row => id === row.id) || {id: id}),
      props.actions
    ) || []
  }

  let data = props.data
  if (!props.loaded) {
    data = fill(new Array(10), {id: ''})
  }

  return (
    <div className={`data-grid data-grid-${props.size} data-grid-${props.orientation}`}>
      {(props.selection || props.sorting) &&
        <div className="data-grid-header">
          {props.selection &&
            <Checkbox
              id="data-grid-select"
              className="py-2 m-0"
              label={<span className="d-none d-sm-block ms-2">{trans('list_select_all')}</span>}
              labelChecked={<span className="d-none d-sm-block ms-2">{trans('list_deselect_all')}</span>}
              checked={0 < props.selection.current.length}
              onChange={() => {
                if (0 === props.selection.current.length) {
                  props.selection.toggleAll(props.data)
                } else {
                  props.selection.toggleAll([])
                }
              }}
              disabled={!props.loaded || props.invalidated}
            />
          }

          {1 < props.count && props.sorting &&
            <GridSort
              {...props.sorting}
              available={getSortableProps(props.definition)}
            />
          }
        </div>
      }

      {0 !== bulkActions.length &&
        <ListBulkActions
          className={classes(props.flush && 'sticky-md-top z-2')}
          count={props.selection.current.length}
          actions={getActions(
            props.selection.current.map(id => props.data.find(row => id === row.id) || {id: id}),
            props.actions
          )}
        />
      }

      <ul className="data-grid-content list-unstyled mb-auto" aria-busy={!props.loaded || props.invalidated}>
        {data.map((row, index) =>
          <GridItem
            key={index}
            size={props.size}
            orientation={props.orientation}
            row={row}
            card={props.card}
            primaryAction={props.loaded ? getPrimaryAction(row, props.primaryAction) : undefined}
            actions={props.loaded ? getActions([row], props.actions) : undefined}
            selected={isRowSelected(row, props.selection ? props.selection.current : [])}
            onSelect={
              props.selection ? () => {
                props.selection.toggle(row, !isRowSelected(row, props.selection ? props.selection.current : []))
              } : null
            }
            loaded={props.loaded}
            invalidated={props.invalidated}
          />
        )}
      </ul>
    </div>
  )
}

implementPropTypes(GridData, DataListView, {
  size: T.oneOf(['sm', 'md']).isRequired,
  orientation: T.oneOf(['col', 'row']).isRequired,
  card: T.func.isRequired // It must be a React component.
})

export {
  GridData
}
