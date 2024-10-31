import React from 'react'
import {PropTypes as T} from 'prop-types'

import {FileThumbnail} from '#/main/app/data/types/file/components/thumbnail'

const ImportFile = (props) => {
  return (
    <div className="my-3">
      {props.importFile.file &&
        <>
          <FileThumbnail
            file={props.importFile.file}
            downloadUrl={['apiv2_transfer_import_download', {id: props.importFile ? props.importFile.id : null}]}
          />
        </>
      }
    </div>
  )
}

ImportFile.propTypes = {
  importFile: T.shape({

  }),
  file: T.shape({

  })
}

export {
  ImportFile
}
