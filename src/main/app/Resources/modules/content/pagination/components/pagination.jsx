import React from 'react'
import {PropTypes as T} from 'prop-types'

import {constants} from '#/main/app/content/pagination/constants'
import {countPages} from '#/main/app/content/pagination/utils'

import {PaginationPages} from '#/main/app/content/pagination/components/pages'
import {PaginationSize} from '#/main/app/content/pagination/components/size'

const Pagination = ({
  totalResults,
  changePage,
  updatePageSize,
  current = 0,
  pageSize = constants.DEFAULT_PAGE_SIZE,
  availableSizes = constants.AVAILABLE_PAGE_SIZES,
  disabled = false
}) => {
  if (availableSizes[0] < totalResults) {
    return (
      <div className="d-flex gap-2" role="presentation">
        <PaginationPages
          disabled={disabled}
          current={current}
          pages={countPages(totalResults, pageSize)}
          changePage={changePage}
        />

        <PaginationSize
          disabled={disabled}
          pageSize={pageSize}
          availableSizes={availableSizes}
          updatePageSize={updatePageSize}
        />
      </div>
    )
  }

  return null
}

Pagination.propTypes = {
  disabled: T.bool.isRequired,
  totalResults: T.number.isRequired,
  current: T.number,
  pageSize: T.number,
  availableSizes: T.arrayOf(T.number),
  changePage: T.func.isRequired,
  updatePageSize: T.func.isRequired
}

export {
  Pagination
}
