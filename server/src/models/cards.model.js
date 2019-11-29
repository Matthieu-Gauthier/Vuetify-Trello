// cards-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const cards = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    order: {type: Number, required: true, default: 0},
    archived: {type: Boolean, required: true, default: false},
    listId: {type: Schema.Types.ObjectId, ref: 'lists', required: true},
    boardId: {type: Schema.Types.ObjectId, ref: 'boards', required: true},
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('cards');
  } catch (e) {
    return mongooseClient.model('cards', cards);
  }
};
