<template>
  <div class="myPosts">
    <div class="header">
      <span class="glyphicon glyphicon-menu-left goback" @click="goback"></span>
      <span>我的关注</span>
      <span class="glyphicon glyphicon-send share"></span>
    </div>
    <div class="postList">
      <div class="post" v-for="(focusUser , index) in allMyFocus" :key="index">
        <div class="userPic">
          <mu-avatar slot="left" color="#fff37" backgroundColor="#9*3FFF37" :size="70">{{focusUser.userName.split('')[0]}}</mu-avatar>
        </div>
        <div class="userName">{{focusUser.userName}}</div>
        <hr>
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
        allMyFocus : []
      }
    },
    name: 'myFocus',
    methods:{
      getAllMyFocus(){
        let self = this;
        axios.get('/api/focusedUsers/' + self.userEmail)
          .then(function (res) {
            for(let email of res.data.focusedUsers){
              axios.get('/api/user/' + email)
                .then(function (res) {
                  self.allMyFocus.push(res.data);
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
      this.getAllMyFocus();
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
        padding-top: 30px;
        padding-left: 50px;
        font-size: 30px;
        .userPic{
          width: 80px;
          height: 80px;
        }
        .userName{
          align-items: center;
          padding-top: 10px;
          padding-left: 50px;
        }
      }
    }
  }
</style>
