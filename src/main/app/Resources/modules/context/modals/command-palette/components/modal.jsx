import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {makeCancelable} from '#/main/app/api'
import {ModalEmpty} from '#/main/app/overlays/modal/components/empty'

import {selectors as contextSelectors} from '#/main/app/context/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {getTool} from '#/main/core/tool/utils'

import {CommandPaletteRecent} from '#/main/app/context/modals/command-palette/components/recent'
import {CommandPaletteSearch} from '#/main/app/context/modals/command-palette/components/search'
import {useKeyPress} from '#/main/app/dom/key'
import {trans} from '#/main/app/intl'
import {CommandPaletteGroup} from '#/main/app/context/modals/command-palette/components/group'
import {LINK_BUTTON} from '#/main/app/buttons'

const CommandPaletteModal = (props) => {
  const contextType = useSelector(contextSelectors.type)
  const contextId = useSelector(contextSelectors.type)
  const contextData = useSelector(contextSelectors.data)
  const contextPath = useSelector(contextSelectors.path)

  // grab tools commands
  const openedTool = useSelector(toolSelectors.name)
  const tools = useSelector(contextSelectors.accessibleTools)

  const [currentTool, setCurrentTool] = useState(openedTool)

  const [toolCommands, setToolCommands] = useState({})
  useEffect(() => {
    let appPromise
    if (contextType) {
      // load apps for every tool defined in this context
      appPromise = makeCancelable(Promise.all(
        tools.map(tool => getTool(tool.name, contextType)
          .then(toolApp => toolApp.default.commands ? toolApp.default.commands(tool, contextType, contextData) : null)
          .catch(e => console.error(e))
        )
      ))

      appPromise.promise
        .then(loadedCommands => setToolCommands(
          // flatten commands list
          loadedCommands.reduce((acc, current) => {
            if (null === current) {
              return acc
            }

            return Object.assign({}, acc, {
              [current.getToolName()]: current
            })
          }, {})
        ))
        .then(
          () => appPromise = null,
          () => appPromise = null
        )
    }

    return () => {
      if (appPromise) {
        appPromise.cancel()
      }
    }
  }, [contextType, contextId])

  const [search, setSearch] = useState('')
  const [activeCommand, setActiveCommand] = useState('')

  useKeyPress('Enter', () => {
    // TODO : activate the selected command
  })

  let pages = []
  if (currentTool) {
    // only get pages for the current tool
    pages = toolCommands[currentTool] ? toolCommands[currentTool].getPages() : []
  } else {
    // get tool main opening
    pages = tools.reduce((acc, current) => {
      // push tool root
      acc.push({
        name: current.name,
        icon: 'fa fa-fw fa-'+current.icon,
        label: trans(current.name, {}, 'tools'),
        type: LINK_BUTTON,
        target: contextPath + '/' + current.name
      })

      // get other pages defined in the command palette
      return Object.keys(toolCommands).reduce((toolPages, current) => toolPages.concat(toolCommands[current].getPages().map(page => Object.assign({}, page, {
        name: current.name+'-'+page.name,
        label: trans(current, {}, 'tools') + ' : ' + page.label,
        target: contextPath + '/' + page.target
      }))), acc)
    }, [])
  }

  let commands = []
  if (currentTool) {
    // only get pages for the current tool
    commands = toolCommands[currentTool] ? toolCommands[currentTool].getCommands() : []
  } else {
    // get pages from all tools
    commands = Object.keys(toolCommands).reduce((acc, current) => acc.concat(toolCommands[current].getCommands().map(command => Object.assign({}, command, {
      name: current+'-'+command.name,
      label: trans(current, {}, 'tools') + ' : ' + command.label
    }))), [])
  }

  return (
    <ModalEmpty {...props} className="command-palette">
      <CommandPaletteSearch
        currentTool={currentTool}
        search={search}
        updateSearch={setSearch}
        setCurrentTool={setCurrentTool}
      />

      <div className="command-palette-content" tabIndex={-1}>
        <CommandPaletteRecent />

        <CommandPaletteGroup
          name={trans('Pages', {}, 'command')}
          search={search}
          actions={pages}
          onClick={(page) => {
            props.fadeModal()
          }}
        />

        <CommandPaletteGroup
          name={trans('Actions', {}, 'command')}
          search={search}
          actions={commands}
          onClick={(command) => {
            props.fadeModal()
          }}
        />
      </div>
    </ModalEmpty>
  )
}

CommandPaletteModal.propTypes = {
  fadeModal: T.func.isRequired
}

export {
  CommandPaletteModal
}
