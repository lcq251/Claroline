import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

/**
 * AiLesson player: simple placeholder displaying the AI model resource
 * configuration (model name / expiry / key status). The legacy course
 * content renderer was removed with the course-generation feature (C-24).
 */
const AiLessonPlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const modelName = get(resource, 'modelName')
  const expiresAt = get(resource, 'expiresAt')
  const hasKey = get(resource, 'hasKey', false)
  const mask = get(resource, 'apiKeyMask', '')

  return (
    <ResourcePage>
      <PageSimple>
        <PageContent>
          <PageSection>
            <div className="text-center py-5">
              <span className="fa fa-robot" style={{fontSize: 48}} />
              <h3 className="mt-3">{resourceNode.name}</h3>
              <p className="text-muted">{trans('ai_lesson_desc', {}, 'resource')}</p>

              <dl className="row mt-4" style={{maxWidth: 420, margin: '0 auto', textAlign: 'left'}}>
                <dt className="col-5 fw-normal text-muted">{trans('model_name', {}, 'resource')}</dt>
                <dd className="col-7">{modelName || '—'}</dd>

                <dt className="col-5 fw-normal text-muted">{trans('expires_at', {}, 'resource')}</dt>
                <dd className="col-7">
                  {expiresAt ? displayDate(expiresAt, false, true) : trans('no_expiration', {}, 'resource')}
                </dd>

                <dt className="col-5 fw-normal text-muted">{trans('key_status', {}, 'resource')}</dt>
                <dd className="col-7">
                  {hasKey ? mask : trans('key_not_configured', {}, 'resource')}
                </dd>
              </dl>
            </div>
          </PageSection>
        </PageContent>
      </PageSimple>
    </ResourcePage>
  )
}

export {
  AiLessonPlayer
}
