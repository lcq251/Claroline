import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {LINK_BUTTON} from '#/main/app/buttons'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {ToolPage, selectors as toolSelectors} from '#/main/core/tool'
import {EvaluationShortcut} from '#/main/evaluation/components/shortcut'

import {getActions} from '#/main/evaluation/sequence/utils'
import {selectors} from '#/main/evaluation/sequence/store'

const SequencePage = (props) => {
  const currentUser = useSelector(securitySelectors.currentUser)

  const toolPath = useSelector(toolSelectors.path)
  const sequence = useSelector(selectors.sequence)
  const sequencePath = useSelector(selectors.path)
  const userEvaluation = useSelector(selectors.evaluation)

  return (
    <ToolPage
      name={sequence ? sequence.name : trans('loading')}
      title={props.title ?
        props.title + ' | ' + sequence.name :
        trans('sequence_name', {name: get(sequence, 'name', trans('loading'))}, 'evaluation')
      }
      description={props.description || get(sequence, 'meta.description')}
      menu={{
        children: currentUser && userEvaluation && (
          <EvaluationShortcut
            {...userEvaluation}
            className="my-auto"
            target={sequencePath+'/progression'}
          />
        ),
        nav: [
          {
            name: 'overview',
            type: LINK_BUTTON,
            label: trans('about'),
            target: sequencePath,
            exact: true
          }, {
            name: 'dashboard',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-gauge',
            label: trans('dashboard'),
            tooltip: 'bottom',
            target: sequencePath+'/dashboard',
            displayed: hasPermission('edit', sequence)
          }
        ],
        toolbar: 'configure more',
        // get actions injected through plugins and the ones defined by the current tool
        actions: sequence ? getActions([sequence], {}, toolPath, currentUser, false) : []
      }}
      {...omit(props, 'breadcrumb', 'styles', 'embedded', 'showHeader', 'title', 'description')}
    >
      {!isEmpty(sequence) && props.children}
    </ToolPage>
  )
}

SequencePage.propTypes = {
  path: T.string,
  children: T.any
}

export {
  SequencePage
}
