const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
  title:{
    type:String,
    require:true
  },
  tags:{
    type:[String],
    require:true
  },
  content:{
    type:String,
    require:true
  },
  authorEmail:{
    type:String,
    require:true
  },
  praise:{
    type:[String]
  },
  collectedNum:{
    type:Number
  },
  comment:{
    type:[String]
  },
  commentNum:{
    type:Number
  },
  collected:{
    type:[String]
  },
  publishedTime:{
    type:String,
    require:true
  },
});

module.exports = mongoose.model('post',postSchema);
