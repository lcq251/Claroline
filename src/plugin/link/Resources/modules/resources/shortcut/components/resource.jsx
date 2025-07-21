import React from 'react'

import {Resource} from '#/main/core/resource'

import {ShortcutPlayer} from '#/plugin/link/resources/shortcut/components/player'
import {ShortcutEditor} from '#/plugin/link/resources/shortcut/components/editor'

const ShortcutResource = (props) =>
  <Resource
    {...props}
    editor={ShortcutEditor}
    pages={[
      {
        path: '/',
        component: ShortcutPlayer,
        exact: true
      }
    ]}
  />

export {
  ShortcutResource
}
