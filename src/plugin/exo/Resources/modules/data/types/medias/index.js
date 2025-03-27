
import {MediasDisplay} from '#/plugin/exo/data/types/medias/components/display'
import {MediasInput} from '#/plugin/exo/data/types/medias/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'medias',
  meta: {
    creatable: false
  },
  components: {
    input: MediasInput,
    display: MediasDisplay
  }
})
