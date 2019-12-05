import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '../../feathers-client'

// Extend the base class
class List extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  
  static instanceDefaults() {
    return {
      name: '',
      color: '#FF000000',
      order: '',
      archived: '',
      boardId: '',
    }
  }  
}
List.modelName = "List"
const servicePath = 'lists'
const servicePlugin = makeServicePlugin({
  Model: List,
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
