import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api/router'

/**
 * Reusable ai-avatar-bot iframe embedder.
 *
 * Given an Aiteacher resource uuid it fetches the widget config (widgetBaseUrl /
 * modelUrl / voice / mode) from the config endpoint, then renders the widget
 * iframe with the brain + TTS endpoints. The widget loads same-origin via
 * /avatar/ so the browser sends the Claroline session cookie; authentication
 * happens in the /apiv2 API layer (session), not via a one-time ticket.
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

    fetch(url(`/apiv2/mindme_aibase/aiteacher/${uuid}/config`), {
      method: 'GET',
      credentials: 'include'
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

  if (!config) {
    return <div className="alert alert-info mb-0" role="alert">{loadingMessage}</div>
  }

  const widgetBaseUrl = config.widgetBaseUrl || '/avatar'
  const params = new URLSearchParams()
  if (config.modelUrl) {
    params.set('model', config.modelUrl)
  }
  if (config.voice) {
    params.set('voice', config.voice)
  }
  if (config.mode) {
    params.set('mode', config.mode)
  }
  if (config.fit) {
    params.set('fit', config.fit)
  }
  if (config.zoom) {
    params.set('zoom', config.zoom)
  }
  if (config.name) {
    params.set('name', config.name)
  }
  if (config.welcome) {
    params.set('welcome', config.welcome)
  }
  if (config.greeting) {
    params.set('greeting', config.greeting)
  }
  if (config.fallback) {
    params.set('fallback', config.fallback)
  }
  if (config.suggestions && config.suggestions.length) {
    params.set('suggestions', JSON.stringify(config.suggestions))
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
