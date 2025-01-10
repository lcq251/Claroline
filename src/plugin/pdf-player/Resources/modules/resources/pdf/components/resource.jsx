import React from 'react'

import {Resource} from '#/main/core/resource'

import {PdfPlayer} from '#/plugin/pdf-player/resources/pdf/containers/player'

const PdfResource = (props) =>
  <Resource
    {...props}
    styles={['claroline-distribution-plugin-pdf-player-pdf-resource']}
    pages={[
      {
        path: '/',
        exact: true,
        component: PdfPlayer
      }
    ]}
  />

export {
  PdfResource
}
