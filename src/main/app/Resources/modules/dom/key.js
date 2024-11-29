import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
const useKeyPress = (key, callback, node = null) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event) => {
      // check if one of the key is part of the ones we want
      if (event.key === key) {
        callbackRef.current(event)
      }
    },
    [key]
  )

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document
    // attach the event listener
    targetNode &&
    targetNode.addEventListener('keydown', handleKeyPress)

    // remove the event listener
    return () =>
      targetNode &&
      targetNode.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress, node])
}

const useCtrlKeyPress = (key, callback, node = null) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event) => {
      // check if one of the key is part of the ones we want
      if (true === event.ctrlKey && event.key === key) {
        callbackRef.current(event)
      }
    },
    [key]
  )

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document
    // attach the event listener
    targetNode &&
    targetNode.addEventListener('keydown', handleKeyPress)

    // remove the event listener
    return () =>
      targetNode &&
      targetNode.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress, node])
}

export {
  useKeyPress,
  useCtrlKeyPress
}
