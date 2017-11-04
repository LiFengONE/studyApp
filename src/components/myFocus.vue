<template>
  <div class="myPosts">
    <div class="header">
      <span class="glyphicon glyphicon-menu-left" @click="goback"></span>
      <span class="glyphicon glyphicon-send"></span>
    </div>
    <div class="postList">
      <div class="post" v-for="(focusUser , index) in allMyFocus" :key="index">
        <div>{{focusUser.userName}}</div>
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
      background-color: #4cae4c;
    }
  }
</style>
