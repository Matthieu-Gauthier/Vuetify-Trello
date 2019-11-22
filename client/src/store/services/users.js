// Bring in the imports from the feathers-client.js file.
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '../../feathers-client'

// Extend the base class
class User extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  
  static instanceDefaults() {
    return {
      username:'',
      displayName:'',
      imageUrl: '',
      password: ''
    }
  }
  // get fullName() {
  //   return `${this.firstName} ${this.lastName}`
  // }
}
User.modelName = "User"
const servicePath = 'users'
const servicePlugin = makeServicePlugin({
  Model: User,
  service: feathersClient.service(servicePath),
  servicePath
})

// Optionally add service-level hooks, here:
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin