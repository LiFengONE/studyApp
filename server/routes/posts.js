const express = require('express');
const router = express.Router();
const post = require('../schemas/post');

/*router.get('/posts',function (req,res,next) {
  res.send('sadas');
  post.find({},function (err,posts) {
    console.log(posts);
    console.log('true')
    res.status(200).json({data:posts});
  });
});*/

module.exports = router;
