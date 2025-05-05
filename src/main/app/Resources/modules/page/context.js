import {createContext} from 'react'

const PageContext = createContext({
  embedded: false,
  menu: [],
  actions: [],
  styles: []
})

export {
  PageContext
}
