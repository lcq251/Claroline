import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const UserEditorFavourites = () => {
  return (
    <EditorPage
      title={trans('favourites', {}, 'workspace')}
      help={trans('favourites_desc', {}, 'workspace')}
    />
  )
}

export {
  UserEditorFavourites
}
