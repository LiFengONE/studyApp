<template>
  <div class="postDetail">
    <div class="header">
      <span class="glyphicon glyphicon-menu-left" @click="goback"></span>
      <span class="glyphicon glyphicon-send"></span>
    </div>
    <div class="postHeader">
      <div class="postInfo">
        <div class="tags">
          <span v-for="( tag , index) in thePost.tags" :key="index">
            <router-link :to="{path:'/post/' + tag}">
            {{tag}}
          </router-link>
          </span>
        </div>
        <div class="title">{{thePost.title}}</div>
        <div class="publishedTime">{{thePost.publishedTime}}</div>
      </div>
      <div class="collect">
        <template v-if="isCollected">
          <span class="glyphicon glyphicon-star collectIcon"></span>
          <span>已收藏</span>
        </template>
        <template v-else>
          <span class="glyphicon glyphicon-star-empty collectIcon" @click="addToCollection"></span>
          <span @click="addToCollection">收藏</span>
        </template>
      </div>
    </div>
    <div class="content">
      {{thePost.content}}
    </div>
    <div class="authorInfo">
      <div class="author">
        <div>
          <mu-avatar slot="left" color="deepOrange300" backgroundColor="purple500">天</mu-avatar>
        </div>
        <div>天才锋</div>
      </div>
      <div class="force">
        <template v-if="isFocused">
          <span>已关注</span>
        </template>
        <template v-else>
          <span @click="addToFocusedUsers">关注</span>
        </template>
      </div>
    </div>
    <div class="publishComment">
      <form @submit.prevent="publishComment">
        <div class="form-group">
          <label for="commentContent" class="col-sm-2 control-label">评论</label>
          <div class="col-sm-10">
            <textarea class="form-control" id="commentContent" v-model="comment.content" placeholder="Comment Content" required></textarea>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-default">发表</button>
          </div>
        </div>
      </form>
    </div>
    <div class="allComment">
      <div class="comment" v-for="(comment , index) in theComment" :key="index">
        <div class="commentHeader">
          <div class="authorName">{{comment.authorEmail}}</div>
          <div class="publishedTime">{{comment.publishedTime}}</div>
        </div>
        <div class="commentContent">
          {{comment.content}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'
  moment.locale(['zh-cn', 'zh-tw']);
  export default {
    components: {},
    name: 'postDetail',
    data(){
      return {
        postId:'',
        thePost:{},
        comment:{
          authorEmail:'',
          content:'',
          publishedTime:'',
          postId:''
        },
        theComment:[],
        isFocused:false,
        isCollected:false
      }
    },
    computed:{
      isSignIn(){
        return this.$store.state.isSignIn;
      }
    },
    methods : {
      getThePost(){
        let postId = this.postId;
        let self = this;
        axios.get('/api/post/' + postId)
          .then(function (res) {
            //alert('获取post');
            self.thePost = {...res.data};
            if(self.isSignIn){
              self.hasFocus();
              self.hasCollect();
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      goback(){
        this.$router.goBack();
      },
      publishComment(){
        let self = this;
        let isSignIn = this.$store.state.isSignIn;
        this.comment.authorEmail = this.$store.state.userEmail;
        this.comment.postId = this.postId;
        this.comment.publishedTime = moment().format("YYYY-MM-DD-HH-mm-ss");
        if(isSignIn){
          axios.post('/api/comment',self.comment)
            .then(function (res) {
              self.theComment = [];
              self.getComment();
              alert('发表评论成功');
              console.log(res);
            })
            .catch(function (err) {
              console.log(err);
            })
        }else {
          alert('请先登录后再发表评论')
        }
      },
      addToCollection(){
        let myEmail = this.$store.state.userEmail;
        let postId = this.postId;
        let isSignIn = this.$store.state.isSignIn;
        let authorEmail = this.thePost.authorEmail;
        let self = this;
        if(! isSignIn) {
          alert('请先登录后再收藏哦')
        }else if(authorEmail === myEmail){
          alert('请不要收藏自己的post哦')
        }else {
          axios.post('/api/collection',{
            myEmail:myEmail,
            postId:postId
          })
            .then(function (res) {
              alert('收藏post成功');
              self.isCollected = true;
              self.$store.state.userInfo = res.data.user;
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      },
      addToFocusedUsers(){
        let myEmail = this.$store.state.userEmail;
        let authorEmail = this.thePost.authorEmail;
        let isSignIn = this.$store.state.isSignIn;
        let self = this;
        if(! isSignIn) {
          alert('请先登录后再关注哦')
        }else if(authorEmail === myEmail){
          alert('请不要关注自己哦')
        }else {
          axios.post('/api/userFocus',{
            myEmail:myEmail,
            authorEmail:authorEmail
          })
            .then(function (res) {
              console.log(res.data.user);
              self.$store.state.userInfo = res.data.user;
              alert('添加关注成功');
              self.isFocused = true;
            })
            .catch(function (err) {
              console.log(err);
            })
        }
      },
      hasFocus(){
        let authorEmail = this.thePost.authorEmail;
        let userInfo = this.$store.state.userInfo;
        for(let userFocusUser of userInfo.focusedUsers){
          if(authorEmail === userFocusUser){
            this.isFocused = true;
            break;
          }
        }
      },
      hasCollect(){
        let userInfo = this.$store.state.userInfo;
        let postId = this.postId;
        for(let id of userInfo.collectionPosts){
          if(id === postId){
            this.isCollected = true;
            break;
          }
        }
      },
      getComment(){
        let self = this;
        axios.get('/api/comment/' + self.postId)
          .then(function (res) {
            for(let commentId of res.data.commentIds){
              axios.get('/api/theComment/' + commentId)
                .then(function (theCommentRes) {
                  self.theComment.push(theCommentRes.data);
                })
               .catch(function (err) {
                  console.log(err);
               });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },
    mounted(){
      this.postId = this.$route.params.postId;
      this.getThePost();
      this.getComment();
    },
    watch : {
//      "$route" : function () {
//        this.postId = this.$route.params.postId;
//        this.thePost = {};
//        this.theComment = [];
//        this.getThePost();
//        this.getComment();
//      }
    }
  }
</script>
<style lang="scss" scoped>
  .postDetail {
    width: 100%;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      font-size: 40px;
      background-color: #13b89b;
    }
    .postHeader{
      display: flex;
      justify-content: space-between;
      padding: 30px;
      font-size: 30px;
      .postInfo{
        padding-bottom: 10px;
        .tags{
          span{
            background-color: #92b8b4;
            padding: 5px;
            font-size: 20px;
            border-radius: 15px;
            margin-right: 5px;
          }
          a {
            color:black;
          }
        }
      }
      .collect{
        align-items: center;
        .collectIcon{
          display: block;
          font-size: 60px;
        }
      }
    }
    .content{
      padding-left: 30px;
      padding-right: 30px;
      font-size: 30px;
    }
    .authorInfo{
     display: flex;
     justify-content: space-between;
     padding: 30px;
     font-size: 20px;
     .author{

     }
      .force{
        span{
          background-color: #92b8b4;
          padding: 5px;
          border-radius: 15px;
          color: white;
          font-size: 30px;
          width: 150px;
          height: 70px;
        }
      }
      .commentHeader{

      }
    }
    .allComment{
      .comment{
        display: flex;
        flex-direction: column;
        .commentHeader{
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          padding: 20px;
        }
        .commentContent{
          padding: 20px;
        }
      }
    }
  }
</style>
