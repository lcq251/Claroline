import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {makeId} from '#/main/app/utils/id'
import {trans, transChoice} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {EditorPage} from '#/main/app/editor'
import {ContentSummary} from '#/main/app/content/components/summary'

import {actions, selectors} from '#/main/evaluation/sequence/editor/store'
import {getNumbering} from '#/main/evaluation/sequence/utils'
import {getFormDataPart} from '#/main/evaluation/sequence/editor/utils'
import {addStep, getStepActions} from '#/main/evaluation/sequence/editor/actions'

const SequenceEditorSummary = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const update = (steps) => dispatch(actions.update(steps, 'steps'))

  const editorPath = useSelector(selectors.path)
  const errors = useSelector(selectors.errors)

  const baseNumbering = useSelector(selectors.numbering)
  const steps = useSelector(selectors.steps)

  function getStepSummary(step) {
    return {
      id: step.id,
      type: LINK_BUTTON,
      numbering: getNumbering(baseNumbering, steps, step),
      label: (
        <div className="text-start" role="presentation">
          {step.title}

          {(!isEmpty(step.primaryResource) || !isEmpty(step.secondaryResources)) &&
            <small className="d-flex gap-2 text-body-secondary">
              {step.primaryResource &&
                <>
                  {trans('resource_name', {
                    type: trans(step.primaryResource.meta.type, {}, 'resource'),
                    name: step.primaryResource.name
                  }, 'resource')}

                  {!isEmpty(step.secondaryResources) &&
                    <span role="presentation">+</span>
                  }
                </>
              }

              {!isEmpty(step.secondaryResources) &&
                transChoice('count_resources', step.secondaryResources.length, {count: step.secondaryResources.length}, 'resource')
              }
            </small>
          }
        </div>
      ),
      target: `${editorPath}/steps/${step.slug}`,
      subscript: !isEmpty(get(errors, getFormDataPart(step.id, steps))) ? {
        type: 'text',
        status: 'danger',
        value: <span className="fa fa-fw fa-exclamation-circle" role="alert" />
      } : undefined,
      additional: getStepActions(
        steps,
        step,
        update,
        (path) => history.push(editorPath+path)
      ),
      children: step.children ? step.children.map(getStepSummary) : []
    }
  }

  return (
    <EditorPage
      title={trans('Scenario')}
      help={trans('Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?')}
    >
      <ContentSummary
        links={steps.map(getStepSummary)}
        noCollapse={true}
      />

      <Button
        type={CALLBACK_BUTTON}
        className={classes('btn btn-primary w-100 mt-3 mb-5', {
          'btn-wave': isEmpty(steps)
        })}
        label={trans('step_add', {}, 'path')}
        size="lg"
        callback={() => {
          const newStepId = makeId()

          // update store
          update(addStep(steps, {id: newStepId}))
          // open new step
          history.push(`${editorPath}/steps/${newStepId}`)
        }}
      />
    </EditorPage>
  )
}

export {
  SequenceEditorSummary
}
