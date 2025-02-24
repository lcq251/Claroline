import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans, transChoice} from '#/main/app/intl/translation'
import {MenuButton, CALLBACK_BUTTON} from '#/main/app/buttons'

const PaginationSize = props =>
  <MenuButton
    containerClassName="results-per-page"
    className="btn btn-body"
    menu={{
      position: 'top',
      align: 'end',
      label: trans('results_per_page'),
      items: props.availableSizes.map((size) => ({
        type: CALLBACK_BUTTON,
        label: transChoice('list_results_count', size, {count: size}, 'platform'),
        active: size === props.pageSize,
        callback: () => props.updatePageSize(size)
      }))
    }}
    disabled={props.disabled}
  >
    {-1 !== props.pageSize ? props.pageSize : trans('all')}
    <span className="fa fa-fw fa-list ms-2" aria-hidden={true} />
  </MenuButton>

PaginationSize.propTypes = {
  disabled: T.bool.isRequired,
  pageSize: T.number.isRequired,
  availableSizes: T.arrayOf(T.number).isRequired,
  updatePageSize: T.func.isRequired
}

export {
  PaginationSize
}
