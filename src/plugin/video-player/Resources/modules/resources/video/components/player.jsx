import React from 'react'
import {PropTypes as T} from 'prop-types'

import {url} from '#/main/app/api'
import {ResourcePage} from '#/main/core/resource'

// The wrapping div is required because it will throw a JS on unmount as the parent is a Fragment.
// Search for "Uncaught DOMException: Node.removeChild: The node to be removed is not a child of this node" for mor information.
const VideoPlayer = props => {
  let lastSaved = 0

  return (
    <ResourcePage>
      <div className="video-container" role="presentation">
        <video
          // height="auto"
          className="video-js vjs-default-skin vjs-fluid vjs-fill vjs-waiting"
          controls={true}
          data-download={false}
          onPlay={(e) => {
            if (props.currentUser) {
              props.updateProgression(props.resourceId, e.target.currentTime, e.target.duration)
            }
          }}
          onPause={(e) => {
            if (props.currentUser) {
              props.updateProgression(props.resourceId, e.target.currentTime, e.target.duration)
            }
          }}
          onTimeUpdate={(e) => {
            if (props.currentUser) {
              const interval = Math.round((e.target.duration / 100) * 5)
              const currentTime = Math.round(e.target.currentTime)
              if (currentTime > lastSaved && 0 === currentTime % interval) {
                props.updateProgression(props.resourceId, e.target.currentTime, e.target.duration)
                lastSaved = currentTime
              }
            }
          }}
        >
          <source src={url(['apiv2_video_file', {id: props.resourceId}])} type={props.mimeType} />
        </video>
      </div>
    </ResourcePage>
  )
}

VideoPlayer.propTypes = {
  resourceId: T.string.isRequired,
  mimeType: T.string.isRequired,
  updateProgression: T.func.isRequired,
  currentUser: T.object
}

export {
  VideoPlayer
}
