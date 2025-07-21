import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'

import {url} from '#/main/app/api'
import {asset} from '#/main/app/config'
import {trans, transChoice} from '#/main/app/intl'
import {selectors as securitySelectors} from '#/main/app/security'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {PageContent, PageSection} from '#/main/app/page'
import {MediaInfo} from '#/main/app/components/media-info'

import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'
import {actions} from '#/plugin/video-player/resources/video/store'

const VideoPlayer = () => {
  let lastSaved = 0

  const dispatch = useDispatch()

  const currentUser = useSelector(securitySelectors.currentUser)
  const embedded = useSelector(resourceSelectors.embedded)
  const showHeader = useSelector(resourceSelectors.showHeader)
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const mimeType = useSelector(resourceSelectors.mimeType)
  const downloadable = useSelector(resourceSelectors.downloadable)

  return (
    <ResourcePage>
      <PageContent>
        <PageSection size="xl" flush={embedded} className={classes({
          'mt-5': !embedded || showHeader,
          'mb-5': !embedded
        })}>
          <video
            className="video-js vjs-fluid vjs-fill vjs-waiting rounded-4 overflow-hidden"
            controls={true}
            data-download={downloadable}
            data-setup={JSON.stringify(Object.assign({
              poster: resourceNode.poster ? asset(resourceNode.poster) : undefined
            }, embedded ? {
              title: resourceNode.name,
              description: resourceNode.meta.description
            } : {}))}
            onPlay={(e) => {
              if (currentUser) {
                dispatch(actions.updateProgression(resourceNode.id, e.target.currentTime, e.target.duration))
              }
            }}
            onPause={(e) => {
              if (currentUser) {
                dispatch(actions.updateProgression(resourceNode.id, e.target.currentTime, e.target.duration))
              }
            }}
            onTimeUpdate={(e) => {
              if (currentUser) {
                const interval = Math.round((e.target.duration / 100) * 5)
                const currentTime = Math.round(e.target.currentTime)
                if (currentTime > lastSaved && 0 === currentTime % interval) {
                  dispatch(actions.updateProgression(resourceNode.id, e.target.currentTime, e.target.duration))
                  lastSaved = currentTime
                }
              }
            }}
          >
            <source src={url(['apiv2_video_file', {id: resourceNode.id}])} type={mimeType} />
          </video>

          <MediaInfo
            title={resourceNode.name}
            description={get(resourceNode, 'meta.descriptionHtml')}
            embedded={embedded}
            meta={(
              <>
                {get(resourceNode, 'estimatedDuration') &&
                  <>
                    <div role="presentation" aria-label={trans('estimated_duration')}>
                      <span className="fa far fa-clock me-2" aria-hidden={true} />
                      {get(resourceNode, 'estimatedDuration') + ' ' + trans('minutes')}
                    </div>
                    <span role="presentation">-</span>
                  </>
                }
                {transChoice('display_views', get(resourceNode, 'meta.views', 0), {count: get(resourceNode, 'meta.views', 0)})}
              </>
            )}
            downloadAction={downloadable ? {
              type: ASYNC_BUTTON,
              request: {
                url: url(['claro_resource_download'], {ids: [resourceNode.id]})
              }
            } : undefined}
          />
        </PageSection>
      </PageContent>
    </ResourcePage>
  )
}

export {
  VideoPlayer
}
