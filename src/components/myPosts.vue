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
      background-color: #4cae4c;
    }
  }
</style>
