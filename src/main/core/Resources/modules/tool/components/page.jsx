import React, {useCallback, useContext} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {ContextPage} from '#/main/app/context/components/page'

import {selectors, actions} from '#/main/core/tool/store'
import {getActions} from '#/main/core/tool/utils'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {MODAL_COMMAND_PALETTE} from '#/main/app/context/modals/command-palette'
import {PageContext} from '#/main/app/page/context'

const ToolPage = props => {
  const toolDef = useContext(PageContext)

  const currentUser = useSelector(securitySelectors.currentUser)
  const toolName = useSelector(selectors.name)
  const toolPath = useSelector(selectors.path)
  const toolData = useSelector(selectors.toolData)
  const currentContext = useSelector(selectors.context)

  const dispatch = useDispatch()
  const reload = useCallback(() => dispatch(actions.reload()), [toolName])

  return (
    <ContextPage
      className={props.className}
      breadcrumb={[
        {
          label: trans(toolName, {}, 'tools'),
          target: toolPath
        }
      ].concat(props.breadcrumb || [])}
      name={trans(toolName, {}, 'tools')}
      title={props.title ?
        props.title + ' | ' + trans(toolName, {}, 'tools') :
        trans(toolName, {}, 'tools')
      }
      description={trans(toolName+'_desc', {}, 'tools')}
      menu={{
        nav: toolDef.menu,
        toolbar: 'search configure more',
        // get actions injected through plugins and the ones defined by the current tool
        actions: getActions(toolData, currentContext, {
          update: reload
        }, toolPath, currentUser).then(loadedActions => [{
          name: 'search',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-wand-magic-sparkles',
          label: trans('search', {}, 'actions') + ' (Ctrl + K)',
          modal: [MODAL_COMMAND_PALETTE],
          displayed: false
        }].concat(loadedActions, toolDef.actions || []))
      }}

      styles={[].concat(toolDef.styles || [], props.styles || [])}
      {...omit(props, 'className', 'breadcrumb', 'title', 'styles')}
    >
      {props.children}
    </ContextPage>
  )
}

ToolPage.propTypes = ContextPage.propTypes
ToolPage.defaultProps = ContextPage.defaultProps

export {
  ToolPage
}
