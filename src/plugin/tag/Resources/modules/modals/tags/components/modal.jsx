import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {constants as listConst} from '#/main/app/content/list'

import {TagCard} from '#/plugin/tag/card/components/tag'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {DataMicro} from '#/main/app/data/components/micro'

const TagsModal = props =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-tags"
    name="tagsPicker"
    size="lg"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('tag', {}, 'tag'),
        primary: true,
        displayed: true,
        render: (tag) => <DataMicro object={tag} color={tag.color} />
      }, {
        name: 'meta.description',
        type: 'string',
        label: trans('description'),
        options: {
          long: true
        }
      }, {
        name: 'elements',
        type: 'number',
        label: trans('elements', {}, 'tag')
      }
    ]}
    card={TagCard}
    displayMode={listConst.DISPLAY_TABLE}
  />

TagsModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool,
  // from modal
  fadeModal: T.func.isRequired
}

TagsModal.defaultProps = {
  url: ['apiv2_tag_list'],
  title: trans('tags', {}, 'tag')
}

export {
  TagsModal
}
