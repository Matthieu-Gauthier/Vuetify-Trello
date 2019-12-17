import feathersClient, {
    makeServicePlugin,
    BaseModel
  } from '../../feathers-client'
  
  // Extend the base class
  class Activity extends BaseModel {
    constructor(data, options) {
      super(data, options)
    }
    
    static instanceDefaults() {
      return {
        text: '',
        boardId: '',
        userId: null,
        user: 'User',
      }
    }  
  }
  Activity.modelName = "Activity"
  const servicePath = 'activities'
  const servicePlugin = makeServicePlugin({
    Model: Activity,
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
  