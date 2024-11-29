
class CommandPalette
{
  #toolName
  #commands = []
  #pages = []

  constructor(toolName) {
    this.#toolName = toolName
  }

  getToolName() {
    return this.#toolName
  }

  getCommands() {
    return this.#commands;
  }

  addCommands(commands) {
    this.#commands = this.#commands.concat(commands)

    return this
  }

  getPages() {
    return this.#pages;
  }

  addPages(pages) {
    this.#pages = this.#pages.concat(pages)

    return this
  }

  searchPage(searchStr) {

  }
}

export {
  CommandPalette
}
