import React from 'react'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

const UserEditorFavourites = () => {
  return (
    <EditorPage
      title={trans('favourites', {}, 'favourite')}
      help={trans('Retrouvez et gérez vos espaces favoris.')}
    />
  )
}

export {
  UserEditorFavourites
}
