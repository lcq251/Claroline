import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {ResourceOverview} from '#/main/core/resource'
import {PageListSection} from '#/main/app/page'
import {Subjects} from '#/plugin/forum/resources/forum/player/components/subjects'
import {hasPermission} from '#/main/app/security'

const ForumOverview = () => {
  const resourcePath = useSelector(resourceSelectors.path)
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  return (
    <ResourceOverview
      primaryAction="create-subject"
      actions={[

      ]}
    >
      <PageListSection size="md" flush={false} className="mb-5">
        <Subjects
          addAction={{
            name: 'create-subject',
            label: trans('add_subject', {}, 'actions'),
            type: LINK_BUTTON,
            target: `${resourcePath}/subjects/form`,
            displayed: hasPermission('post', resourceNode)
          }}
        />
      </PageListSection>
    </ResourceOverview>
  )
}

export {
  ForumOverview
}
