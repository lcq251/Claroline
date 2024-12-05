import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {PlaceholderText} from '#/main/app/components/placeholder'
import {ContentHtml} from '#/main/app/content/components/html'
import {PrivacySummary} from '#/main/privacy/components/summary'
import {API_REQUEST} from '#/main/app/api'

const Privacy = (props) => {
  const dispatch = useDispatch()

  const [loaded, setLoaded] = useState(false)
  const [privacy, setPrivacy] = useState(null)

  useEffect(() => {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_privacy_get'],
        silent: true,
        success: (response) => {
          setLoaded(true)
          setPrivacy(response)
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

  if (privacy) {
    return (
      <>
        <PrivacySummary
          className="mb-4"
          dpo={privacy.dpo}
          countryStorage={privacy.countryStorage}
        />
        <ContentHtml>{privacy.content}</ContentHtml>
      </>
    )
  }

  return null
}


export {
  Privacy
}
