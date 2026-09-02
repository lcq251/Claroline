import React, {useRef, useState} from 'react'
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
 * Aibase player — renders by resource `kind`:
 *
 *  - `model`           : pure AI model — configuration summary + a single-shot
 *                        connection test (one message, no transcript).
 *  - `digital_teacher`: full digital-teacher surface — multi-turn chat + voice
 *                        (Web Speech by default, no host Python) + avatar.
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
  const kind = get(resource, 'kind', 'model')

  const isDigitalTeacher = 'digital_teacher' === kind

  // --- model: single-shot connection test state ---
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT())
  const [testPhase, setTestPhase] = useState('idle') // idle | streaming | done | error
  const [reply, setReply] = useState('')
  const [testError, setTestError] = useState(null)

  // --- digital_teacher: multi-turn chat state ---
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle | streaming | done | error
  const [errorKey, setErrorKey] = useState(null)
  const [ttsNotice, setTtsNotice] = useState(null)
  const ttsEngine = get(resource, 'ttsEngine') || 'none'
  const voiceId = get(resource, 'voiceId')
  const rate = get(resource, 'rate') ?? 1.0
  const pitch = get(resource, 'pitch') ?? 0.0
  const avatarType = get(resource, 'avatarType') || 'none'
  const avatarAsset = get(resource, 'avatarAsset')
  const [voiceType, setVoiceType] = useState(
    ['cloud', 'volc', 'edge', 'selfhosted'].indexOf(ttsEngine) !== -1 ? 'cloud' : 'local'
  )
  const abortRef = useRef(null)

  const streaming = 'streaming' === phase

  // --- digitaal-teacher transcription + chat ---
  const appendToLastAssistant = (delta) => {
    setMessages(prev => {
      const next = prev.slice()
      const last = next[next.length - 1]
      if (last && 'assistant' === last.role) {
        last.content = last.content + delta
      }
      return next
    })
  }

  const chat = () => {
    const userText = (input || '').trim()
    if (!userText || streaming) return

    const history = messages.map(m => ({role: m.role, content: m.content}))
    const transcript = [...history, {role: 'user', content: userText}]

    setMessages(prev => [...prev, {role: 'user', content: userText}, {role: 'assistant', content: ''}])
    setInput('')
    setErrorKey(null)
    setTtsNotice(null)
    setPhase('streaming')

    fetch(url('/apiv2/mindme_aibase/chat', {}), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({resourceUuid: nodeUuid, temperature: 0.8, messages: transcript})
    })
      .then(response => {
        const contentType = response.headers.get('content-type') || ''

        if (contentType.indexOf('application/json') !== -1) {
          return response.json().then(data => {
            setErrorKey(ERROR_KEYS[data.error] || 'ai_test_error_unknown')
            setPhase('error')
          })
        }

        if (!response.body) {
          setErrorKey('ai_test_error_network')
          setPhase('error')
          return null
        }

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
              appendToLastAssistant(payload)
            }
          }

          if (done) {
            setPhase('done')
            return
          }
          return pump()
        })

        abortRef.current = reader
        return pump()
      })
      .catch(() => {
        setErrorKey('ai_test_error_network')
        setPhase('error')
      })
  }

  const stop = () => {
    if (abortRef.current) {
      try {
        abortRef.current.cancel()
      } catch (e) {
        // ignore
      }
    }
    setPhase('done')
  }

  // --- digital-teacher voice (Web Speech local by default, cloud optional) ---
  const speak = (text) => {
    if ('' === text) return

    if ('local' === voiceType) {
      if (!('speechSynthesis' in window)) {
        setTtsNotice('dt_tts_none')
        return
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      if (voiceId) utterance.lang = voiceId
      utterance.rate = rate
      utterance.pitch = pitch
      setTtsNotice(null)
      window.speechSynthesis.speak(utterance)
      return
    }

    if ('none' === ttsEngine) {
      setTtsNotice('dt_tts_none')
      return
    }

    fetch(url('/apiv2/mindme_aibase/tts', {}), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({resourceUuid: nodeUuid, text})
    })
      .then(response => {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.indexOf('application/json') !== -1) {
          return response.json().then(() => setTtsNotice('dt_tts_unavailable'))
        }

        return response.blob().then(blob => {
          const audio = new Audio(URL.createObjectURL(blob))
          setTtsNotice(null)
          try {
            window.speechSynthesis && window.speechSynthesis.cancel()
          } catch (e) {
            // ignore
          }
          audio.play().catch(() => setTtsNotice('dt_tts_unavailable'))
        })
      })
      .catch(() => setTtsNotice('dt_tts_unavailable'))
  }

  const renderAvatar = () => {
    if ('none' === avatarType || ('image' !== avatarType && !avatarAsset)) {
      return (
        <div className="text-muted text-center p-3">
          <span className="fa fa-user fa-3x mb-2" />
          <div>{trans('dt_avatar_none', {}, 'resource')}</div>
        </div>
      )
    }

    if ('image' === avatarType && avatarAsset) {
      return (
        <div className="text-center p-3">
          <img src={avatarAsset} alt="avatar" className="img-fluid rounded" style={{maxHeight: 220}} />
        </div>
      )
    }

    return (
      <div className="text-center p-3">
        <span className="fa fa-user-circle fa-3x mb-2" />
        <div>{avatarType === 'image' ? (avatarAsset || 'image') : trans('dt_avatar_placeholder', {}, 'resource')}</div>
        {avatarAsset && <div className="text-muted small">{avatarAsset}</div>}
      </div>
    )
  }

  // --- model: single-shot connection test ---
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

  // ========================================================================
  //  model 形态：配置摘要 + 单发连接测试
  // ========================================================================
  if (!isDigitalTeacher) {
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

  // ========================================================================
  //  digital_teacher 形态：多轮聊天 + 语音 + 形象
  // ========================================================================
  return (
    <ResourcePage>
      <PageSimple>
        <PageContent>
          <PageSection>
            <div className="d-flex align-items-center justify-content-between" style={{maxWidth: 920}}>
              <div>
                <h3>{resourceNode.name}</h3>
                <p className="text-muted mb-0">{trans('aibase_desc', {}, 'resource')}</p>
                {modelName && <div className="text-muted small">model: {modelName} · platform: {platformType} · TTS: {ttsEngine}</div>}
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span className="small text-muted">{trans('dt_voice_type', {}, 'resource')}</span>
                  <select
                    className="form-select form-select-sm"
                    style={{width: 160}}
                    value={voiceType}
                    onChange={e => setVoiceType(e.target.value)}
                  >
                    <option value="local">{trans('dt_voice_local', {}, 'resource')}</option>
                    <option value="cloud">{trans('dt_voice_cloud', {}, 'resource')}</option>
                  </select>
                </div>
              </div>
              <div style={{width: 200, minHeight: 140, border: '1px solid var(--bs-border-color)', borderRadius: 'var(--bs-border-radius)'}}>
                {renderAvatar()}
              </div>
            </div>
          </PageSection>

          <PageSection>
            <div
              className="p-3 mb-3"
              style={{height: 360, overflowY: 'auto', border: '1px solid var(--bs-border-color)', borderRadius: 'var(--bs-border-radius)', backgroundColor: 'var(--bs-body-bg)'}}
            >
              {0 === messages.length && (
                <div className="text-muted text-center py-5">{trans('dt_chat_placeholder', {}, 'resource')}</div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className="mb-2"
                  style={{textAlign: 'user' === message.role ? 'right' : 'left'}}
                >
                  <div
                    className="d-inline-block p-2"
                    style={{
                      maxWidth: '75%',
                      whiteSpace: 'pre-wrap',
                      borderRadius: 'var(--bs-border-radius)',
                      backgroundColor: 'user' === message.role ? 'var(--bs-primary-bg-subtle)' : 'var(--bs-secondary-bg-subtle)'
                    }}
                  >
                    {message.content}
                    {'assistant' === message.role && streaming && index === messages.length - 1 && (
                      <span className="ms-1"><span className="fa fa-spinner fa-spin" /></span>
                    )}
                  </div>
                  {'assistant' === message.role && 'done' === phase && index === messages.length - 1 && message.content && (
                    <div className="small mt-1">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => speak(message.content)}>
                        <span className="fa fa-volume-up me-1" />
                        {trans('dt_speak', {}, 'resource')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errorKey && <div className="alert alert-danger py-2">{trans(errorKey, {}, 'resource')}</div>}
            {ttsNotice && <div className="alert alert-warning py-2">{trans(ttsNotice, {}, 'resource')}</div>}

            <div className="d-flex" style={{gap: 8, maxWidth: 920}}>
              <textarea
                className="form-control"
                rows={2}
                value={input}
                disabled={streaming}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if ('Enter' === e.key && !e.shiftKey) {
                    e.preventDefault()
                    chat()
                  }
                }}
              />
              {!streaming
                ? (
                  <button className="btn btn-primary" disabled={!hasKey} onClick={chat}>
                    {trans('dt_send', {}, 'resource')}
                  </button>
                )
                : (
                  <button className="btn btn-danger" onClick={stop}>
                    {trans('dt_stop', {}, 'resource')}
                  </button>
                )}
            </div>
          </PageSection>
        </PageContent>
      </PageSimple>
    </ResourcePage>
  )
}

export {
  AibasePlayer
}