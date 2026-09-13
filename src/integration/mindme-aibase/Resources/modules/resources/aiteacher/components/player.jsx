import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api/router'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

/**
 * Aiteacher player — embeds the ai-avatar-bot (Live2D voice avatar) widget.
 *
 * The widget is gated by an nginx auth_request, so we first fetch a one-time
 * ticket from Claroline, then pass it (and the brain endpoint) as widget query
 * params. The LLM brain is the linked Aibase resource (brainAibaseId); the
 * widget calls the OpenAI-compatible /chat/completions endpoint proxied back to
 * Claroline (nginx /apiv2/ -> lamp-claro with Cookie passthrough).
 */
const AiteacherPlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const widgetBaseUrl = get(resource, 'widgetBaseUrl') || '/avatar'
  const brainAibaseId = get(resource, 'brainAibaseId', null)
  const modelUrl = get(resource, 'modelUrl', '')
  const voice = get(resource, 'voice', '')
  const mode = get(resource, 'mode', 'assistant')

  const configured = !!brainAibaseId

  const [ticket, setTicket] = useState(null)
  const [ticketError, setTicketError] = useState(false)

  useEffect(() => {
    if (!configured || !resourceNode) {
      return
    }

    let cancelled = false

    fetch(url(`/apiv2/mindme_aibase/aiteacher/${resourceNode.id}/ticket`), {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then(data => {
        if (!cancelled) {
          setTicket(data.ticket || null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTicketError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [configured, resourceNode])

  const params = new URLSearchParams()
  if (ticket) {
    params.set('tk', ticket)
  }
  if (modelUrl) {
    params.set('model', modelUrl)
  }
  if (voice) {
    params.set('voice', voice)
  }
  if (mode) {
    params.set('mode', mode)
  }
  if (configured) {
    params.set('ollama', `/apiv2/mindme_aibase/aiteacher/${resourceNode.id}`)
    params.set('api', `/apiv2/mindme_aibase/aiteacher/${resourceNode.id}/tts`)
  }

  const iframeSrc = `${widgetBaseUrl}/widget.html?${params.toString()}`

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
            ) : ticketError ? (
              <div className="alert alert-danger" role="alert">
                {trans('aiteacher_ticket_error', {}, 'resource')}
              </div>
            ) : !ticket ? (
              <div className="alert alert-info" role="alert">
                {trans('aiteacher_player_loading', {}, 'resource')}
              </div>
            ) : (
              <iframe
                src={iframeSrc}
                title="digital-teacher"
                style={{width: '100%', height: 640, border: 0}}
                allow="microphone; autoplay"
                allowFullScreen={false}
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
