
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '../../feathers-client'

// Extend the base class
class Card extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  static instanceDefaults() {
    return {
      title: '',
      description: '',
      order: 0,
      archived: false,
      listId: '',
      boardId: '',
      members: [],
    }
  }  
}
Card.modelName = "Card"
const servicePath = 'cards'
const servicePlugin = makeServicePlugin({
  Model: Card,
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
