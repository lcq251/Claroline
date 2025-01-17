import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'

import {url} from '#/main/app/api'
import {asset} from '#/main/app/config'
import {trans, transChoice} from '#/main/app/intl'
import {PageContent, PageSection} from '#/main/app/page'
import {MediaInfo} from '#/main/app/media'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const VideoPlayer = props => {
  let lastSaved = 0

  const embedded = useSelector(resourceSelectors.embedded)
  const showHeader = useSelector(resourceSelectors.showHeader)
  const resourceNode = useSelector(resourceSelectors.resourceNode)

  return (
    <ResourcePage>
      <PageContent>
        <PageSection size="lg" flush={embedded} className={classes({
          'mt-4': showHeader,
          'mb-5': !embedded
        })}>
          <video
            className="video-js vjs-fluid vjs-fill vjs-waiting rounded-4 overflow-hidden"
            controls={true}
            data-download={false}
            data-setup={JSON.stringify(Object.assign({
              poster: resourceNode.poster ? asset(resourceNode.poster) : undefined
            }, embedded ? {
              title: resourceNode.name,
              description: resourceNode.meta.description
            } : {}))}
            onPlay={(e) => {
              if (props.currentUser) {
                props.updateProgression(resourceNode.id, e.target.currentTime, e.target.duration)
              }
            }}
            onPause={(e) => {
              if (props.currentUser) {
                props.updateProgression(resourceNode.id, e.target.currentTime, e.target.duration)
              }
            }}
            onTimeUpdate={(e) => {
              if (props.currentUser) {
                const interval = Math.round((e.target.duration / 100) * 5)
                const currentTime = Math.round(e.target.currentTime)
                if (currentTime > lastSaved && 0 === currentTime % interval) {
                  props.updateProgression(resourceNode.id, e.target.currentTime, e.target.duration)
                  lastSaved = currentTime
                }
              }
            }}
          >
            <source src={url(['apiv2_video_file', {id: resourceNode.id}])} type={props.mimeType} />
          </video>

          <MediaInfo
            title={resourceNode.name}
            description={get(resourceNode, 'meta.descriptionHtml')}
            embedded={embedded}
            meta={(
              <>
                {get(resourceNode, 'evaluation.estimatedDuration') &&
                  <>
                    <div role="presentation" aria-label={trans('estimated_duration')}>
                      <span className="fa far fa-clock me-2" aria-hidden={true} />
                      {get(resourceNode, 'evaluation.estimatedDuration') + ' ' + trans('minutes')}
                    </div>
                    <span role="presentation">-</span>
                  </>
                }
                {transChoice('display_views', get(resourceNode, 'meta.views', 0), {count: get(resourceNode, 'meta.views', 0)})}
              </>
            )}
            downloadAction={{
              type: CALLBACK_BUTTON,
              callback: () => true
            }}
          />
        </PageSection>
      </PageContent>
    </ResourcePage>
  )
}

VideoPlayer.propTypes = {
  mimeType: T.string.isRequired,
  updateProgression: T.func.isRequired,
  currentUser: T.object
}

export {
  VideoPlayer
}
