import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl'
import {url} from '#/main/app/api'
import {PageSection} from '#/main/app/page'
import {constants} from '#/main/core/resources/file/constants'
import {FileThumbnail} from '#/main/app/data/types/file/components/thumbnail'

import {ResourceOverview, selectors as resourceSelectors} from '#/main/core/resource'
import {actions} from '#/main/core/resources/file/store'

const FileOverview = () => {
  const dispatch = useDispatch()

  const file = useSelector(resourceSelectors.resource)
  const downloadable = useSelector(resourceSelectors.downloadable)
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const embedded = useSelector(resourceSelectors.embedded)

  if (!embedded && downloadable && constants.OPENING_DOWNLOAD === file.opening) {
    dispatch(actions.download(resourceNode))
  } else if (constants.OPENING_BROWSER === file.opening) {
    window.location.replace(url(['apiv2_resource_file_raw', {file: file.id}]))
  }

  return (
    <ResourceOverview>
      <PageSection size="lg">
        <FileThumbnail
          className={classes(!get(resourceNode, 'meta.description') && !embedded && 'mt-5')}
          file={merge({}, file, {mimeType: get(resourceNode, 'meta.mimeType')})}
          downloadUrl={downloadable ? ['apiv2_resource_file_raw', {file: file.id}] : undefined}
        />

        {downloadable &&
          <p className="mt-3 text-body-secondary fs-sm">
            <span className="fa fa-fw fa-info-circle me-2" aria-hidden={true} />
            {trans('auto_download_help', {}, 'file')}
          </p>
        }
      </PageSection>
    </ResourceOverview>
  )
}

export {
  FileOverview
}
