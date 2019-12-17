// activities-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const activities = new Schema({
    text: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId,required: true, ref: 'boards' },
    userId: { type: Schema.Types.ObjectId,required: true, ref: 'users' },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('activities');
  } catch (e) {
    return mongooseClient.model('activities', activities);
  }
};
