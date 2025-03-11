/**
 * Helpers to move the user focus to different sections of the page.
 */

function goToContent() {
  document.querySelector('.app-page-body').focus()
}

function goToContextMenu() {
  document.querySelector('.app-context-menu-toggle').focus()
}

function goToToolMenu() {
  document.querySelector('.app-tool-menu .nav-link:first-child').focus()
}

export {
  goToContent,
  goToContextMenu,
  goToToolMenu
}
