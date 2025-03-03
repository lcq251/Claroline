
import {withReducer} from '#/main/app/store/reducer'

import {AudioResource as AudioResourceComponent} from '#/plugin/audio-player/resources/audio/components/resource'
import {reducer, selectors} from '#/plugin/audio-player/resources/audio/store'

const AudioResource = withReducer(selectors.STORE_NAME, reducer)(
  AudioResourceComponent
)

export {
  AudioResource
}
