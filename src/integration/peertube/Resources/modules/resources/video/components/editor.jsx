import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'
import {actions, ResourceEditor, ResourceEditorOverview} from '#/main/core/resource/editor'

import {selectors} from '#/integration/peertube/resources/video/store/selectors'

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
              name: 'autoplay',
              label: trans('autoplay', {}, 'peertube'),
              help: trans('autoplay_help', {}, 'peertube'),
              type: 'boolean'
            }, {
              name: 'looping',
              label: trans('loop', {}, 'peertube'),
              help: trans('loop_help', {}, 'peertube'),
              type: 'boolean'
            }, {
              name: 'controls',
              label: trans('controls', {}, 'peertube'),
              help: trans('controls_help', {}, 'peertube'),
              type: 'boolean'
            }, {
              name: 'resume',
              label: trans('resume', {}, 'peertube'),
              help: trans('resume_help', {}, 'peertube'),
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
              label: trans('timecode_start_help', {}, 'peertube'),
              help: trans('timecode_help',{}, 'peertube'),
              onChange: (checked) => {
                if (!checked) {
                  dispatch(actions.updateResource(null, 'timecodeStart'))
                }
              },
              linked: [
                {
                  name: 'timecodeStart',
                  label: trans('timecode_start', {}, 'peertube'),
                  type: 'time',
                  required: true,
                  displayed: (data) => get(data, '_timecodeStart') || !!get(data, 'timecodeStart')
                },
              ]
            }, {
              name: '_timecodeEnd',
              type: 'boolean',
              label: trans('timecode_end_help', {}, 'peertube'),
              help: trans('timecode_help',{}, 'peertube'),
              onChange: (checked) => {
                if (!checked) {
                  dispatch(actions.updateResource(null, 'timecodeEnd'))
                }
              },
              linked: [
                {
                  name: 'timecodeEnd',
                  label: trans('timecode_end', {}, 'peertube'),
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
