import {createContext} from 'react'

const PageContext = createContext({
  embedded: false,
  name: null,
  menu: [],
  actions: [],
  styles: []
})

export {
  PageContext
}
