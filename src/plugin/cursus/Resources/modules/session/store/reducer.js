import {combineReducers, makeReducer} from '#/main/app/store/reducer'

const reducer = combineReducers({
  status: makeReducer('idle', {

  }),
  errorStatus: makeReducer(null, {

  }),
  error: makeReducer(null, {

  }),
  data: makeReducer(null, {

  })
})

export {

}
