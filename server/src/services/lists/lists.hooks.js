const { authenticate } = require('@feathersjs/authentication').hooks;
// const { setField } = require('feathers-authentication-hooks');

// const setBoardId = setField({
//   from: 'params.board._id',
//   as: 'data.boardId'
// });

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
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
};
