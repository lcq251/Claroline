
import {declareResource} from '#/main/core/resource'
import {LessonResource} from '#/plugin/lesson/resources/lesson/containers/resource'

/**
 * Lesson resource application.
 */
export default declareResource(LessonResource)
  .addPermissions({
    view_internal_notes: {
      order: 2,
      actions: [
        'Voir les notes internes des pages'
      ]
    }
  })
