import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'

import {TagCard} from '#/plugin/tag/card/components/tag'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {TagIcon} from '#/plugin/tag/components/icon'

const TagsModal = props =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-tags"
    name="tagsPicker"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('tag', {}, 'tag'),
        primary: true,
        displayed: true,
        render: (tag) => (
          <div className="d-flex flex-direction-row gap-3 align-items-center" role="presentation">
            <TagIcon tag={tag} size="xs" />
            {tag.name}
          </div>
        )
      }, {
        name: 'meta.description',
        type: 'string',
        label: trans('description'),
        displayed: true,
        options: {
          long: true
        }
      }, {
        name: 'elements',
        type: 'number',
        label: trans('elements', {}, 'tag'),
        displayed: true
      }
    ]}
    card={TagCard}
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
