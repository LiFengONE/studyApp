const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const themeSchema = new Schema({
  name:{
    type:String,
    require:true
  },
  EnglishName:{
    type:String,
    require:true
  }
});

module.exports = mongoose.model('theme',themeSchema);
