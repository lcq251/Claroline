import React from 'react'
import {useSelector} from 'react-redux'

import {ResourcePage} from '#/main/core/resource'

import {UrlDisplay} from '#/plugin/url/components/display'
import {selectors} from '#/plugin/url/resources/url/store'

const UrlPlayer = () => {
  const url = useSelector(selectors.url)

  return (
    <ResourcePage>
      <UrlDisplay
        url={url.url}
        mode={url.mode}
        ratio={url.ratio}
      />
    </ResourcePage>
  )
}

export {
  UrlPlayer
}
