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
      <div className="d-flex flex-column gap-2" role="presentation">
        {displayedActions.map(action =>
          <ActionCard
            {...action}
            key={action.title}
          />
        )}
      </div>

      {!isEmpty(displayedActions) && !isEmpty(dangerousActions) &&
        <hr className="m-0" aria-hidden={true} />
      }

      <div className="d-flex flex-column gap-2" role="presentation">
        {dangerousActions.map((action) =>
          <ActionCard
            {...action}
            key={action.title}
          />
        )}
      </div>
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
