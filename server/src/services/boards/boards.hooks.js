const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');

//Permet de rendre l'utilisateur en cours proprietaire de l'enregistrement
const setUserId = setField({
  from: 'params.user._id',
  as: 'data.ownerId'
});
//Permet de verifier si l'utilisateur en cours est proprietaire de l'enregistrement
const queryUserId = setField({
  from: 'params.user._id',
  as: 'params.query.ownerId'
});

module.exports = {
  before: {
    all: [ authenticate('jwt')],
    find: [
      queryUserId,
    ],
    get: [
      queryUserId
    ],
    create: [
      setUserId
    ],
    update: [
      queryUserId
    ],
    patch: [
      queryUserId
    ],
    remove: [
      queryUserId
    ]
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
