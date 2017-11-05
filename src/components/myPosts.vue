<template>
  <div class="myPosts">
    <div class="header">
      <span class="glyphicon glyphicon-menu-left" @click="goback"></span>
      <span class="glyphicon glyphicon-send"></span>
    </div>
    <div class="postList">
      <div class="post" v-for="(post , index) in allMyPost" :key="index">
        <div class="postHeader">
          <div class="title">{{post.title}}</div>
          <div class="time">{{post.publishedTime}}</div>
        </div>
        <div class="content">{{post.content}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    components: {
    },
    data(){
      return {
        userEmail : '',
        allMyPost : []
      }
    },
    name: 'myPosts',
    methods:{
      getAllMyPost(){
        let self = this;
        axios.get('/api/publishedPost/' + self.userEmail)
          .then(function (res) {
            for(let postId of res.data.publishedPosts){
              axios.get('/api/post/' + postId)
                .then(function (res) {
                  self.allMyPost.push(res.data);
                })
                .catch(function (err) {
                  console.log(err)
                });
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      },
      goback(){
        this.$router.goBack();
      },
    },
    mounted(){
      this.userEmail = this.$route.params.userEmail;
      this.getAllMyPost();
    }
  }
</script>
<style lang="scss" scoped>
  .myPosts {
    width: 100%;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      font-size: 40px;
      background-color: #13b89b;
      .goback{
        padding-left: 50px;
        padding-top: 10px;
      }
      .share{
        padding-right: 50px;
        padding-top: 10px;
      }
    }
    .postList{
      display: flex;
      flex-direction: column;
      height: 80vh;
      .post{
        display: flex;
        flex-direction: column;
        padding-top: 30px;
        padding-left: 50px;
        font-size: 30px;
        margin-top: 40px;
        margin-left: 50px;
        margin-right: 50px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        a{
          color: black;
        }
        .postHeader{
          display: flex;
          justify-content: space-between;
          .title{

          }
          .time{
            font-size: 20px;
            padding-right: 50px;
          }
        }
        .content{
          font-size: 20px;
          margin-top: 5px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
