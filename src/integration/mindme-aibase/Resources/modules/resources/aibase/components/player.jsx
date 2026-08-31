import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'
import {url} from '#/main/app/api/router'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

/**
 * Aibase player.
 * - Top section: model resource configuration (unchanged: model name / expiry /
 *   key status).
 * - Bottom section: a single-message "connection test" that POSTs one message
 *   to /apiv2/mindme_aibase/chat and streams the SSE reply, to verify the configured
 *   model + API key actually connect. No conversation history (single-shot),
 *   no persistence (best-effort kept in component state only).
 */
const ERROR_KEYS = {
  aibase_not_found: 'ai_test_error_not_found',
  no_permission: 'ai_test_error_no_permission',
  expired: 'ai_test_error_expired',
  quota_exceeded: 'ai_test_error_quota',
  access_restricted: 'ai_test_error_restricted',
  no_api_key: 'ai_test_error_no_key',
  api_key_decrypt_failed: 'ai_test_error_key_decrypt'
}

const DEFAULT_PROMPT = () => trans('ai_test_default_prompt', {}, 'resource')

const AibasePlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const modelName = get(resource, 'modelName')
  const expiresAt = get(resource, 'expiresAt')
  const hasKey = get(resource, 'hasKey', false)
  const mask = get(resource, 'apiKeyMask', '')

  const nodeUuid = get(resourceNode, 'uuid') || get(resourceNode, 'id')

  // connection test state (single-shot, no history)
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT())
  const [phase, setPhase] = useState('idle') // idle | streaming | done | error
  const [reply, setReply] = useState('')
  const [errorKey, setErrorKey] = useState(null)

  const testConnection = () => {
    const message = (prompt || '').trim()
    if (!message) return

    setPhase('streaming')
    setReply('')
    setErrorKey(null)

    // Native fetch + ReadableStream: Claroline's redux apiFetch consumes the
    // whole body (JSON/text), which is not suited to event-stream parsing.
    fetch(url('/apiv2/mindme_aibase/chat', {}), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        resourceUuid: nodeUuid,
        temperature: 0.7,
        messages: [{role: 'user', content: message}]
      })
    })
      .then(response => {
        const contentType = response.headers.get('content-type') || ''

        if (contentType.indexOf('application/json') !== -1) {
          // Error contract: failures return a JSON object, not an SSE stream.
          return response.json().then(data => {
            setErrorKey(data.error in ERROR_KEYS ? ERROR_KEYS[data.error] : 'ai_test_error_unknown')
            setPhase('error')
          })
        }

        if (!response.body) {
          setErrorKey('ai_test_error_unknown')
          setPhase('error')
          return null
        }

        // SSE: lines are `data: <delta>` followed by `data: [DONE]`.
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        const pump = () => reader.read().then(({done, value}) => {
          buffer += decoder.decode(value || new Uint8Array(), {stream: !done})

          let newline
          while ((newline = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newline).trim()
            buffer = buffer.slice(newline + 1)

            if (line.startsWith('data: ')) {
              const payload = line.slice(6).trim()
              if ('' === payload || '[DONE]' === payload) continue
              setReply(prev => prev + payload)
            }
          }

          if (done) {
            if (reply.length > 0) {
              setPhase('done')
            } else {
              setErrorKey('ai_test_error_unknown')
              setPhase('error')
            }
            return
          }

          return pump()
        })

        return pump()
      })
      .catch(() => {
        setErrorKey('ai_test_error_network')
        setPhase('error')
      })
  }

  const testEnabled = hasKey && 'streaming' !== phase

  return (
    <ResourcePage>
      <PageSimple>
        <PageContent>
          <PageSection>
            <h3>{resourceNode.name}</h3>
            <p className="text-muted">{trans('aibase_desc', {}, 'resource')}</p>

            <dl className="row mt-3" style={{maxWidth: 420}}>
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
          </PageSection>

          <PageSection>
            <h3>{trans('ai_test_title', {}, 'resource')}</h3>
            <p className="text-muted">{trans('ai_test_desc', {}, 'resource')}</p>

            <textarea
              className="form-control mb-3"
              rows={3}
              value={prompt}
              disabled={'streaming' === phase}
              onChange={e => setPrompt(e.target.value)}
            />

            <button
              className="btn btn-primary"
              disabled={!testEnabled}
              onClick={testConnection}
            >
              {'streaming' === phase
                ? trans('ai_test_sending', {}, 'resource')
                : trans('ai_test_button', {}, 'resource')}
            </button>

            {'done' === phase && (
              <div className="mt-3">
                <div className="alert alert-success py-2">{trans('ai_test_success', {}, 'resource')}</div>
                <strong>{trans('ai_test_reply', {}, 'resource')}</strong>
                <pre className="mt-2 p-3 bg-light border rounded">{reply}</pre>
              </div>
            )}

            {'error' === phase && (
              <div className="alert alert-danger mt-3 py-2">
                {trans(errorKey || 'ai_test_error_unknown', {}, 'resource')}
              </div>
            )}
          </PageSection>
        </PageContent>
      </PageSimple>
    </ResourcePage>
  )
}

export {
  AibasePlayer
}