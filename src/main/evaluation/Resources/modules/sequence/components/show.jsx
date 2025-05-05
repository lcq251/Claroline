import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'
import {useFetch} from '#/main/app/api/fetch'
import {ContentLoader} from '#/main/app/content/components/loader'
import {hasPermission} from '#/main/app/security'

import {selectors} from '#/main/evaluation/sequence/store'
import {SequenceOverview} from '#/main/evaluation/sequence/components/overview'
import {SequenceEditor} from '#/main/evaluation/sequence/editor'
import {SequencePlayer} from '#/main/evaluation/sequence/player'
import {SequenceDashboard} from '#/main/evaluation/sequence/dashboard'
import {SequenceProgression} from '#/main/evaluation/sequence/components/progression'
import {scrollTo} from '#/main/app/dom/scroll'

const SequenceShow = props => {
  const [sequence, status, error, errorCode] = useFetch(selectors.STORE_NAME, ['apiv2_evaluation_sequence_open', {id: props.id}])

  if ('succeeded' === status) {
    return (
      <Routes
        path={props.path+'/'+props.id}
        routes={[
          {
            path: '',
            exact: true,
            component: SequenceOverview
          }, {
            path: '/play',
            component: SequencePlayer/*,
            onEnter: () => {
              scrollTo('.app-page-heading')
            }*/
          }, {
            path: '/edit',
            component: SequenceEditor,
            disabled: !hasPermission('edit', sequence.sequence)
          }, {
            path: '/dashboard',
            disabled: !hasPermission('edit', sequence.sequence),
            component: SequenceDashboard
          }, {
            path: '/progression',
            component: SequenceProgression
          }
        ]}
      />
    )
  }

  if ('failed' === status) {
    return (
      <div>Error</div>
    )
  }

  return (
    <ContentLoader size="lg"/>
  )
}

SequenceShow.propTypes = {
  path: T.string.isRequired,
  id: T.string.isRequired
}

export {
  SequenceShow
}
