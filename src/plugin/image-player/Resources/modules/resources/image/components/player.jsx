import React from 'react'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'

import {url} from '#/main/app/api'
import {PageContent, PageSection} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'
import {MediaInfo} from '#/main/app/components/media-info'

import {trans, transChoice} from '#/main/app/intl'
import {CALLBACK_BUTTON, ModalButton} from '#/main/app/buttons'
import {MODAL_IMAGE_FULLSCREEN} from '#/plugin/image-player/resources/image/modals/fullscreen'

const ImagePlayer = () => {
  const embedded = useSelector(resourceSelectors.embedded)
  const showHeader = useSelector(resourceSelectors.showHeader)
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const downloadable = useSelector(resourceSelectors.downloadable)

  return (
    <ResourcePage>
      <PageContent>
        <PageSection size="lg" flush={embedded} className={classes({
          'mt-4': showHeader,
          'mb-5': !embedded
        })}>
          <ModalButton
            className="rounded-4 focus-ring"
            modal={[MODAL_IMAGE_FULLSCREEN, {
              url: url(['apiv2_image_file', {id: resourceNode.id}]),
              alt: resourceNode.name
            }]}
          >
            <img
              className="img-fluid mx-auto rounded-4"
              src={url(['apiv2_image_file', {id: resourceNode.id}])}
              onContextMenu={(e)=> {
                if (!downloadable) {
                  e.preventDefault()
                }
              }}
            />
          </ModalButton>

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

export {
  ImagePlayer
}
