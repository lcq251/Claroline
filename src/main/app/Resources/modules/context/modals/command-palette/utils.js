import isEmpty from 'lodash/isEmpty'

function nextCommand(commands, current) {
  if (isEmpty(commands)) {
    return null
  }

  if (isEmpty(current)) {
    return commands[0].name
  }

  const commandPos = commands.findIndex(command => current === command.name)
  let nextPos = commandPos + 1
  if (nextPos > commands.length - 1) {
    nextPos = 0
  }

  return commands[nextPos].name
}

function previousCommand(commands, current) {
  if (isEmpty(commands)) {
    return null
  }

  if (isEmpty(current)) {
    return commands[0].name
  }

  const commandPos = commands.findIndex(command => current === command.name)
  let previousPos = commandPos - 1
  if (previousPos < 0) {
    previousPos = commands.length - 1
  }

  return commands[previousPos].name
}

export {
  nextCommand,
  previousCommand
}
