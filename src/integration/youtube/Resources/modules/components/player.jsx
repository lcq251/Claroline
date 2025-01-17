import React, {useCallback, useEffect, useId, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {Video as VideoTypes} from '#/integration/youtube/prop-types'

const YouTubePlayer = (props) => {
  const playerId = useId()
  const [resumed, setResumed] = useState(false)

  let player

  const onTimer = useCallback(() => {
    if (player && props.onTimeUpdate) {
      props.onTimeUpdate(player.getCurrentTime(), player.getDuration() )
    }
  }, [get(props.video, 'videoId')])

  useEffect(() => {
    player = new window.YT.Player(playerId, {
      width: '560',
      height: '315',
      videoId: props.video.videoId,
      playerVars: {
        playlist: props.video.videoId,
        autoplay: props.video.autoplay ? 1 : 0,
        loop: props.video.looping ? 1 : 0,
        controls: props.video.controls ? 2 : 0,
        start: props.video.timecodeStart,
        end: props.video.timecodeEnd
      },
      events : {
        onStateChange: (event) => {
          switch (event.data) {
            case window.YT.PlayerState.PLAYING:
              if(!resumed && props.video.resume) {
                player.seekTo(event.target.getDuration() * ((props.progression || 0) / 100) - 5, true)
                setResumed(true)
              }

              if (props.onPlay) {
                props.onPlay(event.target.getCurrentTime(), event.target.getDuration())
              }

              setInterval(onTimer, 1000)
              break
            case window.YT.PlayerState.PAUSED:
              if (props.onPause) {
                props.onPause(event.target.getCurrentTime(), event.target.getDuration())
              }

              clearInterval(onTimer)
              break
          }
        }
      }
    })

    return () => {
      if (player && props.onPause) {
        props.onPause(player.getCurrentTime(), player.getDuration())
      }
    }
  }, [get(props.video, 'videoId')])

  return (
    <div id={playerId} className={classes('youtube-player', props.className)} role="presentation" />
  )
}

YouTubePlayer.propTypes = {
  className: T.string,
  video: T.shape(
    VideoTypes.propTypes
  ).isRequired,
  progression: T.number,
  onPlay: T.func,
  onPause: T.func,
  onTimeUpdate: T.func
}

export {
  YouTubePlayer
}
