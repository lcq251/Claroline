import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'
import {AvatarWidgetFrame} from '#/integration/mindme-aibase/resources/aiteacher/components/avatar-widget-frame'

/**
 * Aiteacher player — embeds the ai-avatar-bot (Live2D voice avatar) widget via
 * the reusable AvatarWidgetFrame (ticket + brain/TTS endpoints).
 */
const AiteacherPlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const brainAibaseId = get(resource, 'brainAibaseId', null)
  const configured = !!brainAibaseId

  return (
    <ResourcePage>
      <PageSimple>
        <PageContent>
          <PageSection>
            <h3>{resourceNode.name}</h3>
            <p className="text-muted">{trans('aiteacher_desc', {}, 'resource')}</p>

            {!configured ? (
              <div className="alert alert-warning" role="alert">
                <span className="fa fa-exclamation-triangle me-2" />
                {trans('aiteacher_player_not_configured', {}, 'resource')}
              </div>
            ) : (
              <AvatarWidgetFrame
                uuid={resourceNode.id}
                configured={configured}
                height={640}
              />
            )}
          </PageSection>
        </PageContent>
      </PageSimple>
    </ResourcePage>
  )
}

export {
  AiteacherPlayer
}
