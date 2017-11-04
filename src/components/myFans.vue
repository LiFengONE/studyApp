<template>
  <div class="myPosts">
    <div class="header">
      <span class="glyphicon glyphicon-menu-left" @click="goback"></span>
      <span class="glyphicon glyphicon-send"></span>
    </div>
    <div class="postList">
      <div class="post" v-for="(fan , index) in allMyFans" :key="index">
        <div>{{fan.userName}}</div>
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
        allMyFans : []
      }
    },
    name: 'myFans',
    methods:{
      getAllMyFans(){
        let self = this;
        axios.get('/api/fans/' + self.userEmail)
          .then(function (res) {
            for(let fanEmail of res.data.fans){
              axios.get('/api/user/' + fanEmail)
                .then(function (res) {
                  self.allMyFans.push(res.data);
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
      this.getAllMyFans();
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
