import React from 'react'

import {Resource} from '#/main/core/resource'

import {UrlPlayer} from '#/plugin/url/resources/url/components/player'
import {UrlEditor} from '#/plugin/url/resources/url/components/editor'

const UrlResource = (props) =>
  <Resource
    {...props}
    editor={UrlEditor}
    pages={[
      {
        path: '/',
        component: UrlPlayer,
        exact: true
      }
    ]}
  />

export {
  UrlResource
}
