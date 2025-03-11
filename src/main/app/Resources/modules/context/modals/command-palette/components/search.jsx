import React, {useRef} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {useKeyPress} from '#/main/app/dom/key'

const CommandPaletteSearch = (props) => {
  const inputRef = useRef(null)

  useKeyPress('Backspace', () => {
    if (isEmpty(props.search)) {
      props.setCurrentTool(null)
    }
  }, inputRef.current)

  return (
    <div className="command-palette-search border-bottom d-flex flex-row gap-2 align-items-center px-4" role="search">
      <span className="fa fa-search text-body-tertiary me-2" aria-hidden={true} />

      {props.currentTool &&
        <div className="command-palette-search-tool">
          {trans(props.currentTool, {}, 'tools')}
        </div>
      }

      <input
        ref={inputRef}
        className="py-3 px-0 flex-fill"
        type="text"
        autoFocus={true}
        placeholder={trans('search', {}, 'actions')}
        value={props.search}
        onChange={(e) => props.updateSearch(e.target.value || '')}
      />

      {(!isEmpty(props.currentTool) || !isEmpty(props.search)) &&
        <Button
          className="command-palette-clear btn btn-text-secondary py-3 me-n3"
          type={CALLBACK_BUTTON}
          icon="fa fa-times"
          label={trans('delete', {}, 'actions')}
          tooltip="bottom"
          callback={() => {
            props.setCurrentTool(null)
            props.updateSearch('')
          }}
        />
      }
    </div>
  )
}

CommandPaletteSearch.propTypes = {
  currentTool: T.string,
  search: T.string,
  setCurrentTool: T.func.isRequired,
  updateSearch: T.func.isRequired
}

export {
  CommandPaletteSearch
}
