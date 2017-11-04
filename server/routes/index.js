var express = require('express');
var router = express.Router();
const Post = require('../schemas/post');
const User = require('../schemas/user');
const Theme = require('../schemas/theme');
const Comment = require('../schemas/comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//获取所有的帖子posts
// router.get('/posts',function (req,res,next) {
//   Post.find({},function (err,posts) {
//     if(err){
//       throw err;
//     }
//     res.status(200).json(posts);
//   });
// });

//根据标签tag获取该分类的所有posts
router.get('/postsByTag',function (req,res,next) {
   let tag = req.query.tag;
   let outputPosts = [];
   Post.find({},function (err,posts) {
     if(err){
       throw err;
     }
     for(let post of posts){
       for(let theTag of post.tags){
         if(tag === theTag){
           outputPosts.push(post);
           break;
         }
       }
     }
    res.status(200).json(outputPosts);
   })
});

//搜索框搜索post
router.get('/searchPost/:keyword',function (req,res) {
  let keyword = req.params.keyword;
  let reg = new RegExp(keyword,'i');
  Post.find({
    $or:[
      {title:{$regex:reg}},
      {content:{$regex:reg}}
  ]},function (err,posts) {
    if(err) throw err;
    res.status(200).json(posts);
  })
});

//根据tag获取posts
router.get('/posts',function (req,res,next) {
  let tag = req.query.tag;
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let skip = (page - 1) * pageSize;
  let postModel = Post.find({tags:tag}).skip(skip).limit(pageSize);
  postModel.sort({publishedTime:-1});
  postModel.exec(function (err,posts) {
    if(err){
      throw err;
    }
    res.status(200).json(posts);
  });
});

//获得热门的post
router.get('/hotPosts',function (req,res) {
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let skip = (page - 1) * pageSize;
  let postModel = Post.find({commentNum:{$gte:1}}).skip(skip).limit(pageSize);
  postModel.sort({commentNum:-1});
  postModel.exec(function (err,posts) {
    if(err){
      throw err;
    }
    res.status(200).json(posts);
  });
});


//根据作者Email获取该用户所有的posts
// router.get('/posts:authorEmail',function (req,res,next) {
//   let authorEmail = req.params.authorEmail;
//   Post.find({authorEmail},function (err,thePosts) {
//     if(err){
//       throw err;
//     }
//     res.status(200).json(thePosts);
//   })
// });

//增加一个post
router.post('/post',function (req,res,next) {
  let authorEmail = req.body.authorEmail;
  let postData= {...req.body};
  let newPost = new Post(postData);
  newPost.save(function (err,post) {
    if(err){
      throw err;
    }
    // let userPublishedPosts = user.publishedPosts || [];
    // userPublishedPosts.push(post._id);
    User.findOneAndUpdate({email:authorEmail},{$addToSet:{publishedPosts:post._id}},function (err,user) {
      if(err){throw err}
      res.status(200).json({success:true,data:{post:post},msg:"添加post成功!"});
      res.end();
    });
  })
});

//增加一个分类
router.post('/theme',function (req,res) {
  let newTheme = new Theme(req.body);
  newTheme.save(function (err,theme) {
    if(err){throw err}
    res.status(200).json(theme);
  })
});

//根据postId获取post
router.get('/post/:postId',function (req,res) {
  let postId = req.params.postId;
  Post.findById(postId,function (err,post) {
    if(err){
      throw err;
    }
    res.status(200).json(post);
  })
});

//关注他人
router.post('/userFocus',function (req,res) {
  let myEmail = req.body.myEmail;
  let authorEmail = req.body.authorEmail;
  User.findOneAndUpdate({email:myEmail},{$addToSet:{focusedUsers:authorEmail}},{new:true},function (err,user) {
    if(err){
      throw err;
    }
    User.findOneAndUpdate({email:authorEmail},{$addToSet:{fans:myEmail}},function (err,theUser){
      if(err){
        throw err;
      }
      res.status(200).json({msg:"添加关注成功",user:user})
    });
  })
});

//收藏帖子post
router.post('/collection',function (req,res) {
  let myEmail = req.body.myEmail;
  let postId = req.body.postId;
  User.findOneAndUpdate({email:myEmail},{$addToSet:{collectionPosts:postId}},{new:true},function (err,theUser){
    if(err){
      throw err;
    }
    Post.findByIdAndUpdate(postId,{$addToSet:{collected:myEmail},$inc:{collectedNum:1}},function (err,thePost) {
      if(err){
        throw err;
      }
      res.status(200).json({msg:"收藏post成功",user:theUser,post:thePost})
    });
  })
});

//发表评论
router.post('/comment',function (req,res) {
  let commentData = {...req.body};
  let newComment = new Comment(commentData);
  let authorEmail = req.body.authorEmail;
  let postId = req.body.postId;
  newComment.save(function (err,comment) {
    if(err){
      throw err;
    }
    Post.findByIdAndUpdate(postId,{$addToSet:{comment:comment._id},$inc:{commentNum:1}},function (err,post) {
      if(err){throw err}
      User.findOneAndUpdate({email:authorEmail},{$addToSet:{publishedComment:comment._id}},function (err,user) {
        if(err){throw err}
        res.status(200).json({success:true,data:{comment:comment,post:post,user:user},msg:"添加comment成功!"});
        res.end();
      });
    })
  })
});

//删除一个post
router.delete('/post/:id',function (req,res,next) {
  let deletingPostId = req.params.id;
  Post.findByIdAndRemove(deletingPostId,function (err,result) {
    if(err){
      throw err;
    }
    res.status(200).json({msg:"删除成功!"});
  })
});

//根据postId获取评论列表
router.get('/comment/:postId',function (req,res,next) {
  let postId = req.params.postId;
  Post.findById(postId,{comment:1},function (err,post) {
    if(err){
      throw err;
    }
    let commentIds = post.comment;
    // let comments = [];
    // for(let commentId of commentIds){
    //   Comment.findById(commentId,function (err,theComment) {
    //     comments.push(theComment);
    //   })
    // }
    res.status(200).json({commentIds:commentIds});
  })
});

router.get('/theComment/:id',function (req,res) {
  let id = req.params.id;
  Comment.findById(id,function (err,comment) {
    res.status(200).json(comment);
  })
});


//根据postId获取post
router.get('/post/:postId',function (req,res) {
  let postId = req.params.postId;
  Post.findById(postId,function (err,post) {
    if(err) throw err;
    res.status(200).json(post)
  })
});

//根据postId获取点赞数

//根据postId获取作者信息



//获取所有的主题
router.get('/themes',function (req,res,next) {
  Theme.find({},{name:1},function (err,themeNames) {
    if(err){
      throw err;
    }
    res.status(200).json(themeNames);
  })
});

//根据用户email获取其发表的所有post
router.get('/publishedPost/:userEmail',function (req,res) {
  let userEmail = req.params.userEmail;
  User.findOne({email:userEmail},{publishedPosts:1},function (err,user) {
    if(err) throw err;
    let publishedPosts = user.publishedPosts;
    res.status(200).json({publishedPosts:publishedPosts});
  })
});

//根据用户email获取其收藏的所有post
router.get('/collectionPosts/:userEmail',function (req,res) {
  let userEmail = req.params.userEmail;
  User.findOne({email:userEmail},{collectionPosts:1},function (err,user) {
    if(err) throw err;
    let collectionPosts = user.collectionPosts;
    res.status(200).json({collectionPosts:collectionPosts});
  })
});

//根据用户email获取其关注的人
router.get('/focusedUsers/:userEmail',function (req,res) {
  let userEmail = req.params.userEmail;
  User.findOne({email:userEmail},{focusedUsers:1},function (err,user) {
    if(err) throw err;
    let focusedUsers = user.focusedUsers;
    res.status(200).json({focusedUsers:focusedUsers});
  })
});

//根据用户email获取其粉丝
router.get('/fans/:userEmail',function (req,res) {
  let userEmail = req.params.userEmail;
  User.findOne({email:userEmail},{fans:1},function (err,user) {
    if(err) throw err;
    let fans = user.fans;
    res.status(200).json({fans:fans});
  })
});


//根据用户email获取用户信息
router.get('/user/:email',function (req,res,next) {
  let userEmail = req.params.email;
  User.findOne({email:userEmail},function (err,user) {
    if(err){
      throw err;
    }
    res.status(200).json(user)
  })
});

//根据用户ID修改用户信息
router.put('/user',function (req,res,next) {
  let userEmail = req.body.email;
  let userName = req.body.userName;
  let gender = req.body.gender;
  let  age = req.body. age;
  let school = req.body.school;
  let major = req.body.major;
  let grade = req.body.grade;
  User.findOne({email:userEmail},function (err,user) {
    if(err){throw err}
    if(!user){
      res.json({data:{},msg:'用户不存在!'});
    }
    User.update({email:userEmail},{userName,gender,age,school,major,grade},function (err,result) {
      if(err){throw err}
      res.status(200).json({success:true,msg:'修改成功!'});
      res.end();
    });
  })
});

//注册用户
router.post('/signUp',function (req,res,next) {
  let userData = req.body;
  User.findOne({email:userData.email},function (err,user) {
    if(err){
      throw err;
    }
    if(user){
      res.status(200).json({msg:'该邮箱已被注册！'});
      res.end();
    }else {
      let newUser = new User();
      newUser.activationState = false;
      newUser.userName = userData.userName;
      newUser.email = userData.email;
      //newUser.password = newUser.encryptPassword(userData.signUpPassword);
      newUser.password = userData.password;
      newUser.role = userData.role;
      newUser.gender = '';
      newUser.age = 0;
      newUser.school = '';
      newUser.major = '';
      newUser.grade = '';
      newUser.collectionPosts = [];
      newUser.headPicture = '';
      newUser.focusedUsers = [];
      newUser.information = [];
      newUser.publishedPosts = [];
      newUser.fans = [];
      newUser.save(function (err,result) {
        if(err){
          throw err;
        }
        res.status(200).json({data:{user:result},msg:"注册成功!"});
        //newUser.sendCheckEmail(newUser.email);
        res.end();
      });

    }
  })
});

//登录
router.post('/signIn',function (req,res,next) {
  let userData = req.body;
  User.findOne({'email':userData.email},function (err,user) {
    if(err){
      throw err;
    }
    if(!user){
      res.status(404).json({data:{},msg:'用户不存在!'});
      console.log('用户不存在')
    }
    if(userData.password === user.password){
      res.status(200).json({user:user,msg:'登陆成功'})
      console.log('登陆成功')
    }
    // if(user.validPassword){
    //   if(!user.validPassword(userData.password)) {
    //     res.json({data: {}, msg: '密码错误!'});
    //   }
    //   // }else if(!user.activationState){
    //   //   res.json({data:{},msg:'邮箱未激活!'});
    //   // }
    //   else{
    //     res.status(200).json({data:{user:user}});
    //   }
    // }else {
    //   res.json({data:{},msg:'服务错误,请重试!'});
    // }
  })
});

router.get('/allUser',function (req,res) {
  User.find({},function (err,allUser) {
    if(err){throw err}
    res.json(allUser)
  })
});


module.exports = router;
