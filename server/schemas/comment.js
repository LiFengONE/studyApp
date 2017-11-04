const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  authorEmail:{
    type:String,
    require:true
  },
  postId:{
    type:String,
    require:true
  },
  publishedTime:{
    type:String,
    require:true
  },
  content:{
    type:String,
    require:true
  },
  praise:{
    type:[String],
    require:true
  }
});

module.exports = mongoose.model('comment',commentSchema);
