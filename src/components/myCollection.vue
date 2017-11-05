<template>
  <div class="myPosts">
    <div class="header">
      <span class="glyphicon glyphicon-menu-left goback" @click="goback"></span>
      <span>我的收藏</span>
      <span class="glyphicon glyphicon-send share"></span>
    </div>
    <div class="postList">
      <div class="post" v-for="(post , index) in allMyCollection" :key="index">
        <router-link :to="{path:'/thePost/' + post._id}">
          <div class="postHeader">
            <div class="title">
                {{post.title}}
            </div>
            <div class="time">{{changeTime(post.publishedTime)}}</div>
          </div>
          <div class="content">{{post.content}}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import moment from 'moment'
  moment.locale(['zh-cn', 'zh-tw']);
  export default {
    components: {
    },
    data(){
      return {
        userEmail : '',
        allMyCollection : []
      }
    },
    computed:{
    },
    name: 'myCollection',
    methods:{
      getAllMyCollection(){
        let self = this;
        axios.get('/api/collectionPosts/' + self.userEmail)
          .then(function (res) {
            for(let postId of res.data.collectionPosts){
              axios.get('/api/post/' + postId)
                .then(function (res) {
                  self.allMyCollection.push(res.data);
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
      changeTime(publishedTime){
        return moment(publishedTime, "YYYY-MM-DD-HH-mm-ss").fromNow();
      },
      goback(){
        this.$router.goBack();
      },
    },
    mounted(){
      this.userEmail = this.$route.params.userEmail;
      this.getAllMyCollection();
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
