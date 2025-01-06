import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {LINK_BUTTON} from '#/main/app/buttons'

import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'

const SequencePage = (props) =>
  <ToolPage
    breadcrumb={[
      {
        type: LINK_BUTTON,
        label: trans('sequences', {}, 'evaluation'),
        target: `${props.path}/sequences`
      }
    ].concat(props.sequence ? props.breadcrumb : [])}
    poster={get(props.sequence, 'poster')}
    title={trans('sequence_name', {name: get(props.sequence, 'name', trans('loading'))}, 'evaluation')}
    description={get(props.sequence, 'meta.description')}
  >
    {!isEmpty(props.sequence) && props.children}
  </ToolPage>

SequencePage.propTypes = {
  path: T.string,
  sequence: T.shape(
    SequenceTypes.propTypes
  ),
  children: T.any
}

export {
  SequencePage
}
