import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'

import {selectors} from '#/integration/youtube/resources/video/store/selectors'
import {ResourceEditor, ResourceEditorOverview, actions} from '#/main/core/resource/editor'

const VideoEditorOverview = () =>
  <ResourceEditorOverview
    definition={[
      {
        title: trans('general'),
        primary: true,
        hideTitle: true,
        fields: [
          {
            name: 'resource.url',
            label: trans('url'),
            type: 'url',
            required: true
          }
        ]
      }
    ]}
  />

const VideoEditorPlayback = () => {
  const dispatch = useDispatch()

  return (
    <EditorPage
      title={trans('playback')}
      help={trans('playback_help', {}, 'youtube')}
      dataPart="resource"
      definition={[
        {
          title: trans('general'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: 'controls',
              label: trans('controls', {}, 'youtube'),
              help: trans('controls_help', {}, 'youtube'),
              type: 'boolean'
            }, {
              name: 'resume',
              label: trans('resume', {}, 'youtube'),
              help: trans('resume_help', {}, 'youtube'),
              type: 'boolean'
            }, {
              name: 'autoplay',
              label: trans('autoplay', {}, 'youtube'),
              help: trans('autoplay_help', {}, 'youtube'),
              type: 'boolean'
            }, {
              name: 'looping',
              label: trans('loop', {}, 'youtube'),
              help: trans('loop_help', {}, 'youtube'),
              type: 'boolean'
            }
          ]
        }, {
          title: trans('more'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: '_timecodeStart',
              type: 'boolean',
              label: trans('timecode_start_help', {}, 'youtube'),
              help: trans('timecode_help',{}, 'youtube'),
              onChange: (checked) => {
                if (!checked) {
                  dispatch(actions.updateResource(null, 'timecodeStart'))
                }
              },
              linked: [
                {
                  name: 'timecodeStart',
                  label: trans('timecode_start', {}, 'youtube'),
                  type: 'time',
                  required: true,
                  displayed: (data) => get(data, '_timecodeStart') || !!get(data, 'timecodeStart')
                },
              ]
            }, {
              name: '_timecodeEnd',
              type: 'boolean',
              label: trans('timecode_end_help', {}, 'youtube'),
              help: trans('timecode_help',{}, 'youtube'),
              onChange: (checked) => {
                if (!checked) {
                  dispatch(actions.updateResource(null, 'timecodeEnd'))
                }
              },
              linked: [
                {
                  name: 'timecodeEnd',
                  label: trans('timecode_end', {}, 'youtube'),
                  type: 'time',
                  required: true,
                  displayed: (data) => get(data, '_timecodeEnd') || !!get(data, 'timecodeEnd')
                },
              ]
            }
          ]
        }
      ]}
    />
  )
}

const VideoEditor = () => {
  const video = useSelector(selectors.video)

  return (
    <ResourceEditor
      styles={['claroline-distribution-integration-youtube-youtube']}
      additionalData={() => ({
        resource: video
      })}
      overviewPage={VideoEditorOverview}
      pages={[
        {
          name: 'playback',
          title: trans('playback'),
          component: VideoEditorPlayback
        }
      ]}
    />
  )
}

export {
  VideoEditor
}
