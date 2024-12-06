import React from 'react'
import {useSelector} from 'react-redux'

import {ResourceEditor} from '#/main/core/resource'
import {selectors} from '#/plugin/forum/resources/forum/store'

const ForumEditor = () => {
  const forum = useSelector(selectors.forum)

  return (
    <ResourceEditor
      additionalData={() => ({
        resource: forum
      })}
    />
  )
}

export {
  ForumEditor
}
