
function match(action, search) {
  if (action.label.includes(search)) {
    action.label.replace(search, '<b class="fw-bold">'+search+'</b>')

    return true
  }

  return false
}

function highlightSearch(search ) {

}

export {

}
