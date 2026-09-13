import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api/router'

/**
 * Reusable ai-avatar-bot iframe embedder.
 *
 * Given an Aiteacher resource uuid it fetches a one-time ticket (the ticket
 * endpoint also returns the widget config: widgetBaseUrl / modelUrl / voice /
 * mode), then renders the widget iframe with the brain + TTS endpoints.
 *
 * Used by both the Aiteacher resource player and the global support entry in
 * the left app menu.
 */
const AvatarWidgetFrame = (props) => {
  const {
    uuid,
    configured = true,
    height = 640,
    loadingMessage = trans('aiteacher_player_loading', {}, 'resource'),
    errorMessage = trans('aiteacher_ticket_error', {}, 'resource')
  } = props

  const [config, setConfig] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!configured || !uuid) {
      return
    }

    let cancelled = false

    fetch(url(`/apiv2/mindme_aibase/aiteacher/${uuid}/ticket`), {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'}
    })
      .then(response => response.json())
      .then(data => {
        if (!cancelled) {
          setConfig(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [configured, uuid])

  if (error) {
    return <div className="alert alert-danger mb-0" role="alert">{errorMessage}</div>
  }

  if (!config || !config.ticket) {
    return <div className="alert alert-info mb-0" role="alert">{loadingMessage}</div>
  }

  const widgetBaseUrl = config.widgetBaseUrl || '/avatar'
  const params = new URLSearchParams()
  params.set('tk', config.ticket)
  if (config.modelUrl) {
    params.set('model', config.modelUrl)
  }
  if (config.voice) {
    params.set('voice', config.voice)
  }
  if (config.mode) {
    params.set('mode', config.mode)
  }
  params.set('ollama', `/apiv2/mindme_aibase/aiteacher/${uuid}`)
  params.set('api', `/apiv2/mindme_aibase/aiteacher/${uuid}/tts`)

  const iframeSrc = `${widgetBaseUrl}/widget.html?${params.toString()}`

  return (
    <iframe
      src={iframeSrc}
      title="digital-teacher"
      style={{width: '100%', height, border: 0}}
      allow="microphone; autoplay"
      allowFullScreen={false}
    />
  )
}

AvatarWidgetFrame.propTypes = {
  uuid: T.string,
  configured: T.bool,
  height: T.number,
  loadingMessage: T.string,
  errorMessage: T.string
}

export {
  AvatarWidgetFrame
}
