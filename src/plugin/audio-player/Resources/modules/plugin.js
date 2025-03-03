/* eslint-disable */

import {registry} from '#/main/app/plugins/registry'

registry.add('ClarolineAudioPlayerBundle', {
  resources: {
    'audio': () => { return import(/* webpackChunkName: "plugin-audio-resource-audio" */ '#/plugin/audio-player/resources/audio') }
  },
  quizItems: {
    'waveform' : () => { return import(/* webpackChunkName: "quiz-item-waveform" */ '#/plugin/audio-player/quiz/items/waveform') }
  }
})
