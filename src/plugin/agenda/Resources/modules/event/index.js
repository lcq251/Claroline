
import {route} from '#/plugin/agenda/event/routing'

function declareEvent(EventComponent, additional) {
  return {
    component: EventComponent,
    ...additional
  }
}

export {
  route,
  declareEvent
}
