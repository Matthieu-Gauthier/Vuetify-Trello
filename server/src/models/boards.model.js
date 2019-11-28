// boards-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const boards = new Schema({
    name: { type: String, required: true },
    background: { type: String, lowercase: true },
    url: { type: String, },
    ownerId: { type: Schema.Types.ObjectId, ref: 'users' },
    memberIds: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('boards');
  } catch (e) {
    return mongooseClient.model('boards', boards);
  }
};
