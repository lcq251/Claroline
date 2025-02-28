import observe from './observe'
import get from 'lodash/get'

import videojs from 'video.js'

observe('video', callback)

function callback(el) {
  if (parseInt(el.getAttribute('data-download')) !== 1) {
    el.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  let setup = {}
  if (el.getAttribute('data-setup')) {
    setup = JSON.parse(el.getAttribute('data-setup'))
  }

  const autoplay = el.autoplay || false
  videojs(el, {
    class: 'vjs-custom',
    autoplay: autoplay,
    controls: !autoplay,
    preload: 'metadata',
    errorDisplay: true,
    //fluid: true,
    fill: true,
    enableSmoothSeeking: true
  })
    .titleBar.update({
      title: get(setup, 'title'),
      description: get(setup, 'description')
    })
}
