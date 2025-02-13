import React, {useCallback, useContext} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {selectors as securitySelectors} from '#/main/app/security/store'
import {ToolPage} from '#/main/core/tool'

import {getActions} from '#/main/core/resource/utils'
import {selectors, actions} from '#/main/core/resource/store'
import {route} from '#/main/core/resource/routing'
import {route as workspaceRoute} from '#/main/core/workspace/routing'
import {trans} from '#/main/app/intl'
import {EvaluationShortcut} from '#/main/evaluation/components/shortcut'
import {PageContext} from '#/main/app/page/context'

const ResourcePage = (props) => {
  const resourceDef = useContext(PageContext)

  const currentUser = useSelector(securitySelectors.currentUser)
  const basePath = useSelector(selectors.basePath)
  const resourcePath = useSelector(selectors.path)
  const resourceNode = useSelector(selectors.resourceNode)
  const embedded = useSelector(selectors.embedded)
  const showHeader = useSelector(selectors.showHeader)
  const hasEvaluation = useSelector(selectors.hasEvaluation)
  const userEvaluation = useSelector(selectors.resourceEvaluation)

  const dispatch = useDispatch()
  const reload = useCallback(() => dispatch(actions.reload()), [get(resourceNode, 'id')])

  // appends direct parent to the breadcrumb
  const breadcrumb = []
  if (get(resourceNode, 'parent') && !get(resourceNode, 'parent.root')) {
    breadcrumb.push({
      label: get(resourceNode, 'parent.name'),
      target: `${basePath}/${get(resourceNode, 'parent.slug')}`
    })
  }

  return (
    <ToolPage
      className={props.className}
      breadcrumb={breadcrumb.concat(!props.root && !!get(resourceNode, 'parent') ? [
        {
          label: resourceNode.name,
          target: resourcePath
        }
      ] : [], props.breadcrumb || [])}
      name={resourceNode ? resourceNode.name : trans('loading')}
      title={props.title ?
        props.title + ' | ' + resourceNode.name :
        resourceNode.name
      }
      description={props.description || get(resourceNode, 'meta.description')}
      embedded={embedded}
      showHeader={!embedded || showHeader}
      menu={{
        children: hasEvaluation && userEvaluation && (
          <EvaluationShortcut
            {...userEvaluation}
            className="my-auto"
            target={resourcePath+'/progression'}
          />
        ),
        nav: resourceDef.menu,
        toolbar: 'more',
        // get actions injected through plugins and the ones defined by the current tool
        actions: getActions([resourceNode], {
          add: reload,
          update: (resourceNodes) => {
            // checks if the action have modified the current node
            if (resourceNodes.find(node => node.id === resourceNode.id)) {
              reload()
            }
          },
          delete: (resourceNodes) => {
            // checks if the action have deleted the current node
            const currentNode = resourceNodes.find(node => node.id === resourceNode.id)
            if (currentNode) {
              let redirect
              if (currentNode.parent) {
                redirect = route(currentNode.parent)
              } else {
                redirect = workspaceRoute(currentNode.workspace, 'resources')
              }

              props.history.push(redirect)
            }
          }
        }, basePath, currentUser, false).then(loadedActions => [].concat(loadedActions.filter(action => 'configure' !== action.name), resourceDef.actions || []))
      }}

      {...omit(props, 'className', 'breadcrumb', 'styles', 'embedded', 'showHeader', 'title', 'description')}
      styles={[].concat(resourceDef.styles, props.styles || [])}
    >
      {props.children}
    </ToolPage>
  )
} 

ResourcePage.propTypes = ToolPage.propTypes
ResourcePage.defaultProps = ToolPage.defaultProps

export {
  ResourcePage
}
