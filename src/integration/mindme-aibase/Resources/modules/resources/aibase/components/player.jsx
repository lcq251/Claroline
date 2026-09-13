import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'
import {url} from '#/main/app/api/router'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

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

/**
 * Aibase player — pure AI model resource: configuration summary + a
 * single-shot connection test (one message, no transcript).
 *
 * The digital-teacher surface moved to the Aiteacher resource
 * (ai-avatar-bot widget).
 */
const AibasePlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const nodeUuid = get(resourceNode, 'uuid') || get(resourceNode, 'id')
  const hasKey = get(resource, 'hasKey', false)
  const modelName = get(resource, 'modelName')
  const platformType = get(resource, 'platformType', 'custom')
  const baseUrl = get(resource, 'baseUrl')
  const apiKeyMask = get(resource, 'apiKeyMask', '')
  const expiresAt = get(resource, 'expiresAt')

  // --- single-shot connection test state ---
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT())
  const [testPhase, setTestPhase] = useState('idle') // idle | streaming | done | error
  const [reply, setReply] = useState('')
  const [testError, setTestError] = useState(null)

  const testConnection = () => {
    const message = (prompt || '').trim()
    if (!message || 'streaming' === testPhase) return

    setTestPhase('streaming')
    setReply('')
    setTestError(null)

    fetch(url('/apiv2/mindme_aibase/chat', {}), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({resourceUuid: nodeUuid, temperature: 0.7, messages: [{role: 'user', content: message}]})
    })
      .then(response => {
        const contentType = response.headers.get('content-type') || ''

        if (contentType.indexOf('application/json') !== -1) {
          return response.json().then(data => {
            setTestError(ERROR_KEYS[data.error] || 'ai_test_error_unknown')
            setTestPhase('error')
          })
        }

        if (!response.body) {
          setTestError('ai_test_error_unknown')
          setTestPhase('error')
          return null
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let acc = ''

        const pump = () => reader.read().then(({done, value}) => {
          buffer += decoder.decode(value || new Uint8Array(), {stream: !done})

          let newline
          while ((newline = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newline).trim()
            buffer = buffer.slice(newline + 1)

            if (line.startsWith('data: ')) {
              const payload = line.slice(6).trim()
              if ('' === payload || '[DONE]' === payload) continue
              acc += payload
              setReply(acc)
            }
          }

          if (done) {
            setTestPhase(acc.length > 0 ? 'done' : 'error')
            if (0 === acc.length) setTestError('ai_test_error_unknown')
            return
          }
          return pump()
        })
        return pump()
      })
      .catch(() => {
        setTestError('ai_test_error_network')
        setTestPhase('error')
      })
  }

  return (
    <ResourcePage>
      <PageSimple>
        <PageContent>
          <PageSection>
            <h3>{resourceNode.name}</h3>
            <p className="text-muted">{trans('aibase_desc', {}, 'resource')}</p>

            <dl className="row mt-3" style={{maxWidth: 420}}>
              <dt className="col-5 fw-normal text-muted">{trans('platform_type', {}, 'resource')}</dt>
              <dd className="col-7">{platformType || '—'}</dd>

              <dt className="col-5 fw-normal text-muted">{trans('model_name', {}, 'resource')}</dt>
              <dd className="col-7">{modelName || '—'}</dd>

              {baseUrl && (
                <React.Fragment>
                  <dt className="col-5 fw-normal text-muted">{trans('base_url', {}, 'resource')}</dt>
                  <dd className="col-7 text-break">{baseUrl}</dd>
                </React.Fragment>
              )}

              <dt className="col-5 fw-normal text-muted">{trans('expires_at', {}, 'resource')}</dt>
              <dd className="col-7">
                {expiresAt ? displayDate(expiresAt, false, true) : trans('no_expiration', {}, 'resource')}
              </dd>

              <dt className="col-5 fw-normal text-muted">{trans('key_status', {}, 'resource')}</dt>
              <dd className="col-7">
                {hasKey ? apiKeyMask : trans('key_not_configured', {}, 'resource')}
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
              disabled={'streaming' === testPhase}
              onChange={e => setPrompt(e.target.value)}
            />

            <button
              className="btn btn-primary"
              disabled={!hasKey || 'streaming' === testPhase}
              onClick={testConnection}
            >
              {'streaming' === testPhase
                ? trans('ai_test_sending', {}, 'resource')
                : trans('ai_test_button', {}, 'resource')}
            </button>

            {'done' === testPhase && (
              <div className="mt-3">
                <div className="alert alert-success py-2">{trans('ai_test_success', {}, 'resource')}</div>
                <strong>{trans('ai_test_reply', {}, 'resource')}</strong>
                <pre className="mt-2 p-3 bg-light border rounded">{reply}</pre>
              </div>
            )}

            {'error' === testPhase && (
              <div className="alert alert-danger mt-3 py-2">
                {trans(testError || 'ai_test_error_unknown', {}, 'resource')}
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
