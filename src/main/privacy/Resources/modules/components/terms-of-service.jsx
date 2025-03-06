import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {API_REQUEST} from '#/main/app/api'
import {PlaceholderText} from '#/main/app/components/placeholder'
import {Html} from '#/main/app/components/html'

const TermsOfService = () => {
  const dispatch = useDispatch()

  const [loaded, setLoaded] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_platform_terms_of_service'],
        silent: true,
        success: (response) => {
          setLoaded(true)
          setContent(response)
        }
      }
    })
  }, [loaded])

  if (!loaded) {
    return (
      <PlaceholderText
        level={1}
        paragraphs={3}
      />
    )
  }

  if (content) {
    return (
      <Html className="content-text">{content}</Html>
    )
  }

  return null
}

export {
  TermsOfService
}
