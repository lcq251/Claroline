import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'
import {useFetch} from '#/main/app/api/fetch'

import {PathOverview} from '#/main/evaluation/sequence/containers/overview'
import {PathEditor} from '#/main/evaluation/sequence/editor/components/main'
import {PlayerMain} from '#/main/evaluation/sequence/player/containers/main'

const SequenceShow = props => {
  const [sequence, status, error, errorCode] = useFetch('evaluationSequence', ['apiv2_evaluation_sequence_open', {id: props.id}])

  console.log(sequence)

  return (
    <Routes
      path={props.path+'/'+props.id}
      routes={[
        {
          path: '',
          // component: PathOverview,
          exact: true,
          render: () => <PathOverview {...(sequence || {})} path={props.path+'/'+props.id} />
        }, {
          path: '/edit',
          component: PathEditor
        }, {
          path: '/play',
          component: PlayerMain
        }
      ]}
    />
  )
}

SequenceShow.propTypes = {
  path: T.string.isRequired,
  id: T.string.isRequired
}

export {
  SequenceShow
}
