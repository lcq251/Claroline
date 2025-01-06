import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {PageListSection} from '#/main/app/page'

import {ResourceOverview, selectors as resourceSelectors} from '#/main/core/resource'

import {selectors} from '#/plugin/forum/resources/forum/store'
import {Subjects} from '#/plugin/forum/resources/forum/components/subjects'
import {MODAL_SUBJECT} from '#/plugin/forum/resources/forum/modals/subject'
import {useHistory} from 'react-router-dom'

const ForumOverview = () => {
  const history = useHistory()

  const resourcePath = useSelector(resourceSelectors.path)
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const forumId = useSelector(selectors.forumId)

  return (
    <ResourceOverview>
      <PageListSection
        size="md"
        flush={false}
        className="mb-5"
        addAction={{
          name: 'create-subject',
          label: trans('add_subject', {}, 'actions'),
          type: MODAL_BUTTON,
          displayed: hasPermission('post', resourceNode),
          modal: [MODAL_SUBJECT, {
            forumId: forumId,
            onSave: (subject) => history.push(`${resourcePath}/subjects/${subject.id}`)
          }]
        }}
      >
        <Subjects

        />
      </PageListSection>
    </ResourceOverview>
  )
}

export {
  ForumOverview
}
