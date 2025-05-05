import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {Html} from '#/main/app/components/html'

const MediaInfo = ({
  title,
  description = null,
  meta = null,
  embedded = false,
  downloadAction = null
}) => {
  return (
    <>
      {!embedded &&
        <div className="mt-4 d-flex align-items-center gap-3" role="presentation">
          <div role="presentation">
            <h1 className="h4 mb-0">{title}</h1>
            {meta &&
              <div className="text-body-tertiary d-flex align-items-center gap-3 mt-2" role="presentation">
                {meta}
              </div>
            }
          </div>

          {downloadAction &&
            <Button
              className="btn btn-body ms-auto"
              icon="fa fa-download"
              label={trans('download', {}, 'actions')}
              tooltip="bottom"
              {...downloadAction}
            />
          }
        </div>
      }

      {description &&
        <Html className={classes('content-text', !embedded ? 'mt-3' : 'mt-4')}>
          {description}
        </Html>
      }
    </>
  )
}

MediaInfo.propTypes = {
  title: T.string.isRequired,
  description: T.string,
  meta: T.any,
  embedded: T.bool,
  downloadAction: T.shape({
    // Action types
  })
}

export {
  MediaInfo
}
