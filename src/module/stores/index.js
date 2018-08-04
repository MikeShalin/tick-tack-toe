import App from './app'

const stores = {}

Object.assign(stores, {
  app: new App(),
})

export default stores
