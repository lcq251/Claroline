import React from 'react'
import {PropTypes as T} from 'prop-types'

// import {ActivityCalendar} from '#/main/log/activity/components/calendar'
import {LogFunctionalList} from '#/main/log/components/functional-list'

const Activity = (props) =>
  <>
    {/*<ActivityCalendar className="mb-5 mt-4 mx-auto" />*/}

    <LogFunctionalList
      className="mt-4 mb-5"
      name={props.name}
      url={props.url}
    />
  </>

Activity.propTypes = {
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array])
}

export {
  Activity
}
