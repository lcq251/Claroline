import observe from './observe'
import $ from 'jquery'
import get from 'lodash/get'

/* global videojs */

observe('video', callback)

function callback(el) {
  const html = $(el).parent().html()
  const parsed = $.parseHTML(html)[0]
  if (parseInt(el.getAttribute('data-download')) !== 1) {
    $(el).on('contextmenu', (e) => {e.preventDefault()})
  }

  let setup = {}
  if (el.getAttribute('data-setup')) {
    setup = JSON.parse(el.getAttribute('data-setup'))
  }

  const autoplay = parsed.autoplay ? parsed.autoplay : false
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
