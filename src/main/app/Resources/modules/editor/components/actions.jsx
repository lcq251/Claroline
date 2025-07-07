import React, {useContext, useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'

import {EditorPage} from '#/main/app/editor/components/page'
import {EditorContext} from '#/main/app/editor/context'
import {ActionCard, ActionCardSkeleton} from '#/main/app/action/components/card'
import {constants, pickActionSet, ActionTypes, PromisedActionTypes} from '#/main/app/action'

const EditorActions = ({
  actions = []
}) => {
  const editorDef = useContext(EditorContext)

  const [loaded, setLoaded] = useState(false)
  const [loadedActions, setActions] = useState([])
  useEffect(() => {
    if (actions instanceof Promise) {
      pickActionSet(constants.ACTION_SET_ADVANCED, actions).then(editorActions => {
        setActions(editorActions)
        setLoaded(true)
      })
    } else {
      setActions(pickActionSet(constants.ACTION_SET_ADVANCED, actions))
      setLoaded(true)
    }
  }, [editorDef.name, actions])

  const displayedActions = loadedActions
    .filter(action => (undefined === action.displayed || action.displayed) && !action.dangerous && (!action.managerOnly || editorDef.canAdministrate))

  const dangerousActions = loadedActions
    .filter(action => (undefined === action.displayed || action.displayed)  && action.dangerous && (!action.managerOnly || editorDef.canAdministrate))

  return (
    <EditorPage
      title={trans('advanced_actions', {}, 'actions')}
    >
      {!loaded &&
        <>
          <div className="d-flex flex-column gap-2" role="presentation">
            <ActionCardSkeleton />
            <ActionCardSkeleton />
            <ActionCardSkeleton />
          </div>
          <hr className="m-0" aria-hidden={true} />
          <div className="d-flex flex-column gap-2" role="presentation">
            <ActionCardSkeleton dangerous={true} />
          </div>
        </>
      }

      {loaded &&
        <>
          {!isEmpty(displayedActions) &&
            <div className="d-flex flex-column gap-2" role="presentation">
              {displayedActions.map(action =>
                <ActionCard
                  {...action}
                  key={action.name}
                />
              )}
            </div>
          }

          {!isEmpty(displayedActions) && !isEmpty(dangerousActions) &&
            <hr className="m-0" aria-hidden={true} />
          }

          {!isEmpty(dangerousActions) &&
            <div className="d-flex flex-column gap-2" role="presentation">
              {dangerousActions.map((action) =>
                <ActionCard
                  {...action}
                  key={action.name}
                />
              )}
            </div>
          }
        </>
      }
    </EditorPage>
  )
}

EditorActions.propTypes = {
  actions: T.oneOfType([
    // a regular array of actions
    T.arrayOf(T.shape(
      ActionTypes.propTypes
    )),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedActionTypes.propTypes
    )
  ])
}

export {
  EditorActions
}
