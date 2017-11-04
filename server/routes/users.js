var express = require('express');
var router = express.Router();
const Post = require('../schemas/post');
const User = require('../schemas/user');

/* GET users listing. */

//获取所有的主题
router.get('/themess',function (req,res,next) {
  Theme.find({},{name:1},function (err,themeNames) {
    if(err){
      throw err;
    }
    res.status(200).json(themeNames);
  })
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//根据用户email获取用户信息
router.get('/user:email',function (req,res,next) {
  let userEmail = req.params.email;
  User.findById({email:userEmail},function (err,user) {
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
  User.findOne({"email":userData.email},function (err,user) {
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
  console.log(userData);
  User.findOne({'email':userData.email},function (err,user) {
    if(err){throw err}
    if(!user){
      res.json({data:{},msg:'用户不存在!'});
    }
    res.json(user);
    // if(userData.password === user.password){
    //   res.status(200).json({msg:'登陆成功'})
    // }
    // if(!user.validPassword(userData.password)) {
    //   res.json({data: {}, msg: '密码错误!'});
    // }
    // // }else if(!user.activationState){
    // //   res.json({data:{},msg:'邮箱未激活!'});
    // // }
    // else{
    //   res.status(200).json({data:{user:user}});
    // }
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

router.get('/allUser',function (req,ress) {
  User.find({},function (err,allUser) {
    if(err){throw err}
    res.json(allUser)
  })
});
module.exports = router;
