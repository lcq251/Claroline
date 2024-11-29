import React, {createElement} from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Checkbox} from '#/main/app/input/components/checkbox'

import {DataListView} from '#/main/app/content/list/prop-types'
import {
  getPrimaryAction,
  getActions,
  isRowSelected
} from '#/main/app/content/list/utils'

import {GridItem} from '#/main/app/content/list/grid/components/item'
import classes from 'classnames'
import merge from 'lodash/merge'
import {Action as ActionTypes, PromisedAction as PromisedActionTypes} from '#/main/app/action/prop-types'

const GridItem = props =>
  <li className="data-grid-item-container">
    {createElement(props.card, {
      className: classes({
        'data-card-selectable': !!props.onSelect,
        'data-card-selected': props.selected
      }),
      size: props.size,
      orientation: props.orientation,
      data: props.row,
      primaryAction: props.primaryAction,
      actions: props.actions
    })}

    {props.onSelect &&
      <input
        type="checkbox"
        className="data-grid-item-select form-check-input"
        checked={props.selected}
        onChange={props.onSelect}
      />
    }
  </li>

GridItem.propTypes = {
  size: T.string.isRequired,
  orientation: T.string.isRequired,
  row: T.object.isRequired,

  primaryAction:  T.oneOfType([
    // a regular action
    T.shape(merge({}, ActionTypes.propTypes, {
      label: T.node // make label optional
    })),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedActionTypes.propTypes
    )
  ]),

  actions: T.oneOfType([
    // a regular array of actions
    T.arrayOf(T.shape(
      ActionTypes.propTypes
    )),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedActionTypes.propTypes
    )
  ]),

  card: T.func.isRequired, // It must be a React component.
  selected: T.bool,
  onSelect: T.func
}

GridItem.defaultProps = {
  selected: false
}

const GridData = props => {
  return (
    <ul className="data-grid-content list-unstyled mb-auto">
      {props.data.map((row) =>
        <GridItem
          key={row.id}
          size={props.size}
          orientation={props.orientation}
          row={row}
          card={props.card}
          primaryAction={getPrimaryAction(row, props.primaryAction)}
          actions={getActions([row], props.actions)}
          selected={isRowSelected(row, props.selection ? props.selection.current : [])}
          onSelect={
            props.selection ? () => {
              props.selection.toggle(row, !isRowSelected(row, props.selection ? props.selection.current : []))
            } : null
          }
        />
      )}
    </ul>
  )
}

implementPropTypes(GridData, DataListView, {
  size: T.oneOf(['sm', 'lg']).isRequired,
  orientation: T.oneOf(['col', 'row']).isRequired,
  card: T.func.isRequired // It must be a React component.
})

export {
  GridData
}
