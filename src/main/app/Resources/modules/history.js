import isEmpty from 'lodash/isEmpty'
import {now} from '#/main/app/intl'

function parseRecent(recent) {
  return Object.keys(recent).map(recentId => recent[recentId])
}

function getRecent() {
  const recent = window.localStorage.getItem('recent')

  if (isEmpty(recent)) {
    return {}
  }

  return JSON.parse(recent) || {}
}

function hasRecent() {
  return !isEmpty(getRecent())
}

function addRecent(id, type, target, name, description, thumbnail) {
  const recent = getRecent()

  // push new element in recent list or update the opening date (will make it appear at the top of the list in ui)
  recent[id] = {
    id: id,
    type: type,
    name: name,
    target: target,
    description: description,
    thumbnail: thumbnail,
    date: now()
  }

  window.localStorage.setItem('recent', JSON.stringify(recent))

  return recent
}

function removeRecent(id) {
  const recent = getRecent()

  delete recent[id]

  window.localStorage.setItem('recent', JSON.stringify(recent))

  return recent
}

function emptyRecent() {
  window.localStorage.setItem('recent', null)
}

export {
  hasRecent,
  getRecent,
  parseRecent,
  addRecent,
  removeRecent,
  emptyRecent
}
