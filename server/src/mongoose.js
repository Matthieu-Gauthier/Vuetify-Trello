const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function (app) {
  mongoose.connect(app.get('mongodb'), { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => { console.log('connected') },
    err => { console.log(err) }
  );
  
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
