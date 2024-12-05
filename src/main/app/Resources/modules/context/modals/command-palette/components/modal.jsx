import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {makeCancelable} from '#/main/app/api'
import {useKeyPress} from '#/main/app/dom/key'
import {trans} from '#/main/app/intl'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ModalEmpty} from '#/main/app/overlays/modal/components/empty'

import {selectors as contextSelectors} from '#/main/app/context/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {getTool} from '#/main/core/tool/utils'

import {CommandPaletteRecent} from '#/main/app/context/modals/command-palette/components/recent'
import {CommandPaletteSearch} from '#/main/app/context/modals/command-palette/components/search'
import {CommandPaletteGroup} from '#/main/app/context/modals/command-palette/components/group'
import {stripDiacritics} from '#/main/app/utils/text'
import {nextCommand, previousCommand} from '#/main/app/context/modals/command-palette/utils'

const CommandPaletteModal = (props) => {
  const contextType = useSelector(contextSelectors.type)
  const contextId = useSelector(contextSelectors.type)
  const contextData = useSelector(contextSelectors.data)
  const contextPath = useSelector(contextSelectors.path)

  // grab available commands by loading tool definitions for all tools enabled in the current context
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
        target: '/'+current.name
      })

      if (toolCommands[current.name]) {
        // get other pages defined in the command palette
        console.log(toolCommands[current.name].getPages())
        acc = acc.concat(toolCommands[current.name].getPages().map(page => Object.assign({}, page, {
          name: current.name+'-'+page.name,
          label: trans(current.name, {}, 'tools') + ' : ' + page.label
        })))
      }

      return acc
    }, [])
  }

  let commands = [].concat(pages
    .filter(page => undefined === page.displayed || page.displayed)
    .map(page => Object.assign({}, page, {
      search: stripDiacritics(page.label.toLowerCase()),
      commandType: 'page',
      target: contextPath + page.target
    }))
  )

  let actions = []
  if (currentTool) {
    // only get pages for the current tool
    actions = toolCommands[currentTool] ? toolCommands[currentTool].getCommands() : []
  } else {
    // get pages from all tools
    actions = Object.keys(toolCommands).reduce((acc, current) => acc.concat(toolCommands[current].getCommands().map(command => Object.assign({}, command, {
      name: current+'-'+command.name,
      label: trans(current, {}, 'tools') + ' : ' + command.label
    }))), [])
  }

  commands = commands.concat(actions
    .filter(action => undefined === action.displayed || action.displayed)
    .map(action => Object.assign({
      search: stripDiacritics(action.label.toLowerCase()),
      commandType: 'action'
    }, action))
  )

  let matchCommands = []
  if (search) {
    const cleanSearch = stripDiacritics(search.toLowerCase())
    commands.map(command => {
      const searchableLabel = stripDiacritics(command.label.toLowerCase())

      const match = searchableLabel.search(cleanSearch)
      if (-1 !== match) {

      }

      if (searchableLabel.includes(cleanSearch)) {
        matchCommands.push(Object.assign({}, command, {
          label: command.label.replace(props.search, '<b class="fw-bold">'+props.search+'</b>')
        }))
      }
    })
  } else {
    matchCommands = commands
  }

  const [activeCommand, setActiveCommand] = useState(null)
  /*useEffect(() => {
    if (!isEmpty(matchCommands)) {
      setActiveCommand(matchCommands[0].name)
    }
  })*/

  useKeyPress('Enter', () => {
    if (activeCommand) {
      const commandBtn = document.getElementById(`cmd-${activeCommand}`)
      if (commandBtn) {
        commandBtn.click()
      }
    }
  })

  useKeyPress('ArrowDown', () => setActiveCommand(nextCommand(matchCommands, activeCommand)))
  useKeyPress('ArrowUp', () => setActiveCommand(previousCommand(matchCommands, activeCommand)))

  return (
    <ModalEmpty {...props} className="command-palette">
      <CommandPaletteSearch
        activeCommand={activeCommand}
        currentTool={currentTool}
        search={search}
        updateSearch={setSearch}
        setCurrentTool={setCurrentTool}
      />

      <div className="command-palette-content" tabIndex={-1}>
        <CommandPaletteRecent />

        <CommandPaletteGroup
          activeCommand={activeCommand}
          name={trans('Pages', {}, 'command')}
          actions={matchCommands.filter(command => 'page' === command.commandType)}
          onClick={(page) => {
            props.fadeModal()
          }}
          setActiveCommand={setActiveCommand}
        />

        <CommandPaletteGroup
          activeCommand={activeCommand}
          name={trans('Actions', {}, 'command')}
          actions={matchCommands.filter(command => 'action' === command.commandType)}
          onClick={(command) => {
            props.fadeModal()
          }}
          setActiveCommand={setActiveCommand}
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
