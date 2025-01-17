import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {EvaluationJumbotron} from '#/main/evaluation/components/jumbotron'

import {selectors} from '#/main/evaluation/sequence/store'
import {SequencePage} from '#/main/evaluation/sequence/components/page'
import {PageContent} from '#/main/app/page'

/**
 * Display the User progression in a Sequence.
 */
const SequenceProgression = () => {
  const userEvaluation = useSelector(selectors.evaluation)

  return (
    <SequencePage
      title={trans('my_progression')}
    >
      <PageContent>
        <EvaluationJumbotron
          evaluation={userEvaluation}
        />
      </PageContent>
    </SequencePage>
  )
}

export {
  SequenceProgression
}
