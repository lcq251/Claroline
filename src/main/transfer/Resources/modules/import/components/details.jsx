import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {PageTabbedSection} from '#/main/app/page'

import {ImportLog} from '#/main/transfer/import/components/log'
import {ImportFile} from '#/main/transfer/import/components/file'

const ImportDetails = (props) =>
  <PageTabbedSection
    size="md"
    path={props.path}
    tabs={[
      {
        path: '',
        exact: true,
        title: trans('file'),
        render: () => (
          <ImportFile importFile={props.importFile} />
        )
      }, {
        path: '/log',
        title: trans('log', {}, 'transfer'),
        render: () => (
          <ImportLog
            logs={[
              {
                type: 'info',
                message: 'Lecture du fichier',
                date: '2024-10-25\T09:05:20'
              }, {
                type: 'success',
                message: '3 lignes à importer trouvées'
              }, {
                line: '1',
                type: 'warning',
                message: 'Utilisateur non trouvé'
              }, {
                line: '2',
                type: 'success',
                message: 'L\'utilisateur "Axel Penin" a été créé',
                link: '#'
              }, {
                line: '2',
                type: 'warning',
                message: 'Le groupe "Groupe test" n\'existe pas',
                link: '#'
              }
            ]}
          />
        )
      }
    ]}
  />

ImportDetails.propTypes = {
  path: T.string,
  importFile: T.shape({

  })
}

export {
  ImportDetails
}
