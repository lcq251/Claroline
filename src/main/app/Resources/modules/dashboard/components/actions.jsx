import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {ActionCard} from '#/main/app/action/components/card'
import {PageContent, PageSection} from '#/main/app/page'

const DashboardActions = ({
  actions = []
}) => {
  const displayedActions = actions
    .filter(action => (undefined === action.displayed || action.displayed) && !action.dangerous)

  const dangerousActions = actions
    .filter(action => (undefined === action.displayed || action.displayed)  && action.dangerous)

  return (
    <PageContent>
      <PageSection size="md" className="my-4">
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
      </PageSection>
    </PageContent>
  )
}

DashboardActions.propTypes = {
  actions: T.arrayOf(T.shape({
    title: T.string.isRequired,
    help: T.string.isRequired,
    displayed: T.bool,
    action: T.object.isRequired,
    dangerous: T.bool
  }))
}


export {
  DashboardActions
}
