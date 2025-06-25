import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {Subject as SubjectTypes} from '#/plugin/forum/resources/forum/prop-types'

const SubjectModal = (props) =>
  <FormModal
    {...omit(props, 'forumId', 'subject')}
    name="forumSubjectForm"
    title={trans(!props.subject ? 'new_subject' : 'subject', {}, 'forum')}
    target={!props.subject ?
      ['apiv2_forum_create_subject', {id: props.forumId}] :
      ['apiv2_forum_subject_update', {id: props.subject.id}]
    }
    isNew={!props.subject}
    data={props.subject}
    saveLabel={trans(!props.subject ? 'add_subject' : 'save_subject', {}, 'actions')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'poster',
            label: trans('poster'),
            type: 'poster',
            hideLabel: true
          }, {
            name: 'title',
            type: 'string',
            label: trans('title'),
            required: true
          }, {
            name: 'content',
            type: 'html',
            label: trans('post', {}, 'forum')
          }, {
            name: 'tags',
            type: 'tag',
            label: trans('tags')
          }
        ]
      }
    ]}
  />

SubjectModal.propTypes = {
  subject: T.shape(SubjectTypes.propTypes),
  forumId: T.string.isRequired
}

export {
  SubjectModal
}
