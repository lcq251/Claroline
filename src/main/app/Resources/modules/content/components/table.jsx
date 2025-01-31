import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const TableCell = props =>
  <td className={classes(props.className, {
    'text-center': 'center' === props.align,
    'text-end': 'right' === props.align
  })}>
    {props.children}
  </td>

TableCell.propTypes = {
  className: T.string,
  align: T.oneOf(['left', 'center', 'right']),
  children: T.node
}

const TableHeaderCell = props =>
  <th scope="col" className={classes(props.className, {
    'text-center': 'center' === props.align,
    'text-end': 'right' === props.align
  })}>
    {props.children}
  </th>

TableHeaderCell.propTypes = {
  className: T.string,
  align: T.oneOf(['left', 'center', 'right']),
  children: T.node
}

const TableSortingCell = props =>
  <th
    scope="col"
    className={classes(props.className, 'sorting-cell', {
      'text-center': 'center' === props.align,
      'text-end': 'right' === props.align
    })}
    onClick={e => {
      e.stopPropagation()
      if (!props.disabled) {
        props.onSort()
      }
    }}
  >
    {props.children}

    <span aria-hidden="true" className={classes('fa', !props.direction ? 'fa-sort' : (1 === props.direction ? 'fa-sort-asc' : 'fa-sort-desc'))} />
  </th>

TableSortingCell.propTypes = {
  className: T.string,
  align: T.oneOf(['left', 'center', 'right']),
  direction: T.oneOf([0, -1, 1]),
  onSort: T.func.isRequired,
  children: T.node,
  disabled: T.bool.isRequired
}

const TableHeader = props =>
  <thead>
    <tr>
      {props.children}
    </tr>
  </thead>

TableHeader.propTypes = {
  children: T.node.isRequired
}

const TableRow = props =>
  <tr {...props}>
    {props.children}
  </tr>

TableRow.propTypes = {
  children: T.node.isRequired
}

const Table = props =>
  <table
    className={classes('table', {
      'table-sm': props.condensed
    }, props.className)}
  >
    {props.children}
  </table>

Table.propTypes = {
  children: T.array.isRequired,
  className: T.string,
  condensed: T.bool
}

export {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableSortingCell
}
