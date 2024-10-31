import React, {useEffect} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Routes} from '#/main/app/router'
import {URL_BUTTON} from '#/main/app/buttons'

import {TransferPage} from '#/main/transfer/components/page'
import {ImportEditor} from '#/main/transfer/import/editor/containers/main'
import {ImportFile as ImportFileTypes} from '#/main/transfer/tools/import/prop-types'
import {ImportDetails} from '#/main/transfer/import/components/details'

const ImportShow = props => {
  useEffect(() => {
    props.openForm(props.importFile)
  }, [props.importFile ? props.importFile.id : props.importFile])

  return (
    <TransferPage
      path={props.importFile ? props.path + '/' + props.importFile.id : ''}
      transferFile={props.importFile}
      actions={[
        {
          name: 'download',
          //size: 'lg',
          type: URL_BUTTON,
          label: trans('download', {}, 'actions'),
          target: get(props.importFile, 'file.url'),
          disabled: !get(props.importFile, 'file.url'),
          primary: true
        }
      ]}
    >
      {props.importFile &&
        <Routes
          path={props.path+'/'+props.importFile.id}
          routes={[
            {
              path: '/edit',
              render: () => (
                <ImportEditor
                  path={props.path+'/'+props.importFile.id}
                />
              )
            }, {
              path: '/',
              render: () => (
                <ImportDetails
                  path={props.path+'/'+props.importFile.id}
                  importFile={props.importFile}
                />
              )
            }
          ]}
        />
      }
    </TransferPage>
  )
}

ImportShow.propTypes = {
  path: T.string.isRequired,
  importFile: T.shape(
    ImportFileTypes.propTypes
  )
}

export {
  ImportShow
}
