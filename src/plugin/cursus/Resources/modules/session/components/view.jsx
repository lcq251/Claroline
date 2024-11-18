import React, {useEffect} from 'react'
import {PropTypes as T} from 'prop-types'
import {ToolPage} from '#/main/core/tool'

const SessionView = (props) => {
  useEffect(() => {

  }, [props.id])

  return (
    <ToolPage>

    </ToolPage>
  )
}

SessionView.propTypes = {
  id: T.string.isRequired,
  session: T.object
}

export {
  SessionView
}
