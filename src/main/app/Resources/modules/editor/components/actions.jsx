import React, {useContext} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'

import {EditorPage} from '#/main/app/editor/components/page'
import {EditorContext} from '#/main/app/editor/context'
import {ActionCard} from '#/main/app/action/components/card'

const EditorActions = ({
  actions = []
}) => {
  const editorDef = useContext(EditorContext)

  const displayedActions = actions
    .filter(action => (undefined === action.displayed || action.displayed) && !action.dangerous && (!action.managerOnly || editorDef.canAdministrate))

  const dangerousActions = actions
    .filter(action => (undefined === action.displayed || action.displayed)  && action.dangerous && (!action.managerOnly || editorDef.canAdministrate))

  return (
    <EditorPage
      title={trans('advanced_actions', {}, 'actions')}
    >
      {displayedActions.map(action =>
        <ActionCard
          {...action}
          key={action.title}
          className="mb-2"
        />
      )}

      {!isEmpty(displayedActions) && !isEmpty(dangerousActions) &&
        <hr className="mt-3 mb-4" aria-hidden={true} />
      }

      {dangerousActions.map((action) =>
        <ActionCard
          {...action}
          key={action.title}
          className="mb-2"
        />
      )}
    </EditorPage>
  )
}

EditorActions.propTypes = {
  actions: T.arrayOf(T.shape({
    title: T.string.isRequired,
    help: T.string.isRequired,
    managerOnly: T.bool,
    displayed: T.bool,
    action: T.object.isRequired,
    dangerous: T.bool
  }))
}

export {
  EditorActions
}
