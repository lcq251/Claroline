import React, {useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api/router'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

const ERROR_KEYS = {
  digital_teacher_not_found: 'dt_error_not_found',
  no_permission: 'dt_error_no_permission',
  expired: 'dt_error_expired',
  no_api_key: 'dt_error_no_key',
  api_key_decrypt_failed: 'dt_error_key_decrypt'
}

/**
 * DigitalTeacher player — the "digital teacher" chat surface.
 *
 * Session model: EPHEMERAL. The transcript lives in this component's state and
 * is sent back with every turn; nothing is persisted server-side (reload resets).
 *
 * Voice: after an assistant reply, the 🔊 button POSTs the reply text to
 * /apiv2/mindme_digital/digital_teacher/tts. If no real TTS engine is configured the
 * player degrades to silent text-only chat (dt_tts_unavailable).
 *
 * Avatar: a placeholder area is rendered from avatarType/avatarAsset. This is
 * the integration point for a Live2D/VRM renderer (future step).
 */
const DigitalTeacherPlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)

  const nodeUuid = get(resourceNode, 'uuid') || get(resourceNode, 'id')
  const hasKey = get(resource, 'hasKey', false)
  const modelName = get(resource, 'modelName')
  const ttsEngine = get(resource, 'ttsEngine') || 'none'
  const voiceId = get(resource, 'voiceId')
  const rate = get(resource, 'rate') ?? 1.0
  const pitch = get(resource, 'pitch') ?? 0.0
  const avatarType = get(resource, 'avatarType') || 'none'
  const avatarAsset = get(resource, 'avatarAsset')

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle | streaming | done | error
  const [errorKey, setErrorKey] = useState(null)
  const [ttsNotice, setTtsNotice] = useState(null)
  const [voiceType, setVoiceType] = useState(
    ['cloud', 'volc', 'edge', 'selfhosted'].indexOf(ttsEngine) !== -1 ? 'cloud' : 'local'
  )
  const abortRef = useRef(null)

  const streaming = 'streaming' === phase

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

    fetch(url('/apiv2/mindme_digital/digital_teacher/chat_stream', {}), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        resourceUuid: nodeUuid,
        temperature: 0.8,
        messages: transcript
      })
    })
      .then(response => {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.indexOf('application/json') !== -1) {
          return response.json().then(data => {
            setErrorKey(ERROR_KEYS[data.error] || 'dt_error_unknown')
            setPhase('error')
          })
        }

        if (!response.body) {
          setErrorKey('dt_error_network')
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
        setErrorKey('dt_error_network')
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

  const speak = (text) => {
    if ('' === text) return

    // A) Local: browser Web Speech API (no backend call).
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

    // B) Cloud: backend /tts (volc / edge / custom engine from the resource).
    if ('none' === ttsEngine) {
      setTtsNotice('dt_tts_none')
      return
    }

    fetch(url('/apiv2/mindme_digital/digital_teacher/tts', {}), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({resourceUuid: nodeUuid, text})
    })
      .then(response => {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.indexOf('application/json') !== -1) {
          return response.json().then(() => {
            setTtsNotice('dt_tts_unavailable')
          })
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

  // Avatar area (integration point for a Live2D/VRM renderer).
  const renderAvatar = () => {
    if ('none' === avatarType) {
      return (
        <div className="text-muted text-center p-3">
          <span className="fa fa-user fa-3x mb-2" />
          <div>{trans('dt_avatar_none', {}, 'resource')}</div>
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

  return (
    <ResourcePage>
      <PageSimple>
        <PageContent>
          <PageSection>
            <div className="d-flex align-items-center justify-content-between" style={{maxWidth: 920}}>
              <div>
                <h3>{resourceNode.name}</h3>
                <p className="text-muted mb-0">{trans('digital_teacher_desc', {}, 'resource')}</p>
                {modelName && <div className="text-muted small">model: {modelName} · TTS: {ttsEngine}</div>}
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

            {errorKey && (
              <div className="alert alert-danger py-2">{trans(errorKey, {}, 'resource')}</div>
            )}
            {ttsNotice && (
              <div className="alert alert-warning py-2">{trans(ttsNotice, {}, 'resource')}</div>
            )}

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
  DigitalTeacherPlayer
}
