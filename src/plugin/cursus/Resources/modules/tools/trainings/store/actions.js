import {makeActionCreator} from '#/main/app/store/actions'

export const TRAININGS_UPDATE_REGISTRATIONS = 'TRAININGS_UPDATE_REGISTRATIONS'

export const actions = {}

actions.updateRegistrations = makeActionCreator(TRAININGS_UPDATE_REGISTRATIONS, 'registration')
