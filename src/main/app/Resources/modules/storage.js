import {useCallback, useSyncExternalStore} from 'react'

function dispatchStorageEvent(key, newValue) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }))
}

function setLocalStorageItem(key, value) {
  const encodedValue = JSON.stringify(value)

  window.localStorage.setItem(key, encodedValue)
  dispatchStorageEvent(key, encodedValue)
}

function getLocalStorageItem(key) {
  return window.localStorage.getItem(key)
}

function useLocalStorageSubscribe(callback) {
  window.addEventListener("storage", callback)

  return () => window.removeEventListener("storage", callback)
}

/**
 * @param {string} key - The key used to access the local storage value.
 * @param {mixed} initialValue - The initial value to use if there is no item in the local storage with the provided key.
 */
function useLocaleStorage(key, initialValue) {
  const getSnapshot = () => getLocalStorageItem(key)

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot
  )

  const setLocalValue = useCallback((newValue) => {
    setLocalStorageItem(key, newValue)
  }, [key])

  return [
    store ? JSON.parse(store) : initialValue,
    setLocalValue
  ]
}

export {
  useLocaleStorage
}
