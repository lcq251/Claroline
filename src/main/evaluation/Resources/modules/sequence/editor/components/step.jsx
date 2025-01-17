import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {scrollTo} from '#/main/app/dom/scroll'
import {LINK_BUTTON} from '#/main/app/buttons'
import {EditorPage} from '#/main/app/editor'

import {selectors} from '#/main/evaluation/sequence/editor/store'
import {flattenSteps, getNext, getNumbering, getPrevious} from '#/main/evaluation/sequence/utils'
import {getFormDataPart} from '#/main/evaluation/sequence/editor/utils'

const PathEditorStep = props => {
  const editorPath = useSelector(selectors.path)
  const steps = useSelector(selectors.steps)
  const flatSteps = flattenSteps(steps)
  const step = flatSteps.find(s => props.match.params.slug === s.slug || props.match.params.slug === s.id)
  if (!step) {
    props.history.push(editorPath+'/steps')
  }

  const workspace = useSelector(selectors.workspace)
  const hasCustomNumbering = useSelector(selectors.hasCustomNumbering)
  const numbering = useSelector(selectors.numbering)
  const stepNumbering = getNumbering(numbering, steps, step)

  const next = getNext(steps, step)
  const previous = getPrevious(steps, step)

  return (
    <EditorPage
      title={(stepNumbering ? stepNumbering + ' ' + step.title : step.title) || trans('step', {}, 'path')}
      dataPart={getFormDataPart(step.id, steps)}
      actions={[
        {
          name: 'summary',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-list',
          label: trans('open-summary', {}, 'actions'),
          target: editorPath+'/steps',
          exact: true,
          onClick: () => scrollTo('.app-editor-body')
        }
      ].concat([
        {
          name: 'previous',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-chevron-up',
          label: previous ? trans('previous_step', {title: previous.title}, 'evaluation') : trans('summary'),
          target: editorPath+'/steps/' + (previous ? previous.slug : ''),
          exact: true,
          onClick: () => scrollTo('.app-editor-body')
        }, {
          name: 'next',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-chevron-down',
          label: next ? trans('next_step', {title: next.title}, 'evaluation') : null,
          target: editorPath+'/steps/' + (next ? next.slug : ''),
          disabled: !next,
          onClick: () => scrollTo('.app-editor-body')
        }
      ])}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'poster',
              type: 'poster',
              hideLabel: true,
              label: trans('poster')
            }, {
              name: 'title',
              type: 'string',
              label: trans('title'),
              autoFocus: true,
              required: true
            }
          ]
        }, {
          title: trans('Activité'),
          subtitle: trans('Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'),
          primary: true,
          fields: [
            {
              name: 'primaryResource',
              type: 'resource',
              label: trans('resource'),
              hideLabel: true,
              options: {
                embedded: true,
                showHeader: true,
                picker: {
                  contextId: workspace.id
                }
              },
              linked: [
                {
                  name: 'showResourceHeader',
                  type: 'boolean',
                  label: trans('show_resource_header', {}, 'resource'),
                  displayed: (step) => !isEmpty(step.primaryResource)
                }
              ]
            }
          ]
        }, {
          title: trans('further_information'),
          subtitle: trans('further_information_help'),
          primary: true,
          fields: [
            {
              name: 'display.numbering',
              type: 'string',
              label: trans('step_numbering', {}, 'path'),
              displayed: hasCustomNumbering
            }, {
              name: 'description',
              type: 'html',
              label: trans('description'),
              help: trans('Décrivez le travail à réaliser et/ou les objectifs d\'apprentissage de l\'activité.'),
              recommended: true,
              options: {
                workspace: workspace
              }
            }, {
              name: '_enableSecondaryResources',
              type: 'boolean',
              label: trans('Ajouter des ressources complémentaires', {}, 'path'),
              help: trans('Ajoutez des liens vers les ressources qui peuvent être utiles à la réalisation de l\'activité.', {}, 'path'),
              calculated: (step) => step._enableSecondaryResources || !isEmpty(step.secondaryResources),
              linked: [
                {
                  name: 'secondaryResources',
                  type: 'resources',
                  label: trans('secondary_resources', {}, 'path'),
                  displayed: (step) => step._enableSecondaryResources || !isEmpty(step.secondaryResources),
                  options: {
                    picker: {
                      contextId: workspace.id
                    }
                  }
                }
              ]
            }
          ]
        }
      ]}
    />
  )
}

PathEditorStep.propTypes = {
  // from Route
  match: T.shape({
    params: T.shape({
      slug: T.string
    })
  }).isRequired,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired
}

export {
  PathEditorStep
}
