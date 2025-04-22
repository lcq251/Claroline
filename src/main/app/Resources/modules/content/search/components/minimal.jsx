import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const SearchMinimal = ({
  className,
  search,
  onSearch,
  placeholder = trans('search', {}, 'actions'),
  autoFocus = false,
  disabled = false
}) =>
  <div className={classes('d-flex flex-row align-items-center bg-secondary-subtle rounded-2 py-1', className)}>
    <span className="fa fa-search text-secondary-emphasis ms-3" />
    <input
      className="form-control border-0 shadow-none bg-transparent"
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      value={search}
      autoFocus={autoFocus}
      disabled={disabled}
    />

    {(search && !disabled) &&
      <Button
        className="btn btn-text-body focus-ring rounded-2"
        type={CALLBACK_BUTTON}
        icon="fa fa-delete-left"
        label={trans('remove_filters', {}, 'actions')}
        callback={() => onSearch('')}
        tooltip="bottom"
      />
    }
  </div>

SearchMinimal.propTypes = {
  search: T.string,
  placeholder: T.string,
  autoFocus: T.bool,
  onSearch: T.func.isRequired,
  disabled: T.bool
}

export {
  SearchMinimal
}
