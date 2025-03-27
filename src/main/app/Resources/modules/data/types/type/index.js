
import {TypeDisplay} from '#/main/app/data/types/type/components/display'
import {declareDataType} from '#/main/app/data/types'

/**
 * Displays meta (e.g. icon, name, description) about the type of object.
 * Used by ResourceNodes, WidgetContents, DataSources, Events.
 *
 * Note. This may be managed by the choice type later as we plan to add icon and description for choices.
 */
export default declareDataType({
  name: 'type',
  meta: {
    creatable: false
  },
  components: {
    input: TypeDisplay, // no input, the common use case is to use a grid selection
    display: TypeDisplay
  }
})
