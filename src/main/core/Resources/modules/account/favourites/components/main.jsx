import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const AccountFavourites = () => {
  return (
    <EditorPage
      title={trans('favourites', {}, 'workspace')}
      help={trans('favourites_desc', {}, 'workspace')}
    >
    </EditorPage>
  )
}

export {
  AccountFavourites
}
