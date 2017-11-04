<template>
  <div class="userDiv">
    <div class="userInfo">
      <div class="head">
        <div class="skin">
          <mu-icon value="local_library" :size="50"></mu-icon>
        </div>
        <div class="settings">
          <mu-icon value="brightness_high" :size="50"></mu-icon>
        </div>
      </div>
      <div class="userPic">
        <img src="../assets/郭嘉.jpg" class="img-circle">
      </div>
      <div class="name">{{userInfo.userName}}</div>
      <div class="ageAndSex">
        <div class="age">20</div>
        <div class="sex">♂</div>
      </div>
      <div class="stuInfo">
        <div class="school">华中科技大学</div>
        <div class="major">软件工程</div>
      </div>
    </div>
    <div class="userInform">
      <div class="attention">
        <router-link :to="{path:'/myFocus/' + userInfo.email }">我的关注</router-link>
      </div>
      <div class="fans">
        <router-link :to="{path:'/myFans/' + userInfo.email }">我的粉丝</router-link>
      </div>
      <div class="collection">
        <router-link :to="{path:'/myCollection/' + userInfo.email }">我的收藏</router-link>
      </div>
      <div class="message">我的消息</div>
      <div class="posts">
        <router-link :to="{path:'/myPosts/' + userInfo.email }">我的帖子</router-link>
      </div>
    </div>
    <div class="quit" @click="quit">
      <mu-raised-button label="退出登录" class="demo-raised-button quitBtn"></mu-raised-button>
    </div>
  </div>
</template>

<script>
  import myPosts from '../components/myPosts.vue'
  import axios from 'axios'
  export default {
    components: {
      myPosts,
    },
    name: 'userCenter',
    data(){
      return {
      }
    },
    computed : {
      userInfo(){
        return {...this.$store.state.userInfo}
      }
    },
    methods : {
      quit(){
        this.$store.state.isSignIn = false;
        this.$store.state.userEmail = '';
        this.$store.state.inUserCenter = false;
        this.$store.state.userInfo = {};
      },
      getUserInfo(){
//        let self = this;
//        let userEamil = this.$store.state.userEmail;
//        axios.get('/api/user/',{
//          params:{
//            email:userEamil
//          }
//        })
//          .then(function (res) {
//          self.userInfo = res.data;
//        })
      },
    },
    mounted(){
      this.getUserInfo()
    }
  }
</script>
<style scoped lang="scss">
  .userDiv{
    background-color: #13b89b;
    height: 100%;
    width: 100%;
    border: solid 1px red;
    .userInfo{
      display: flex;
      width: 100%;
      height: 30vh;
      flex-direction: column;
      align-items: center;
      border: solid 1px red;
      .head{
        height: 10vh;
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        padding: 10px;
      }
      .userPic{
        img{
          width: 150px;
          height: 150px;
        }
      }
      .name{

      }
      .ageAndSex{
        display: flex;
        justify-content: space-around;
        width: 50%;
        font-size: 30px;
      }
      .stuInfo{
        display: flex;
        justify-content: space-around;
        font-size: 25px;
        width: 100%;
      }
    }
    .userInform{
      background-color: #032926;
      display: flex;
      flex-direction: column;
      //justify-content: space-around;
      height: 40vh;
      width: 100%;
      border: solid 2px green;
      font-size: 35px;
      a{
        color:white;
      }
      div{
        flex: 1;
        text-align: center;
      }
    }
    .quit{
      display: flex;
      justify-content: center;
      .quitBtn{
        width: 200px;
        height: 70px;
        font-size: 40px;
        margin-top: 50px;
      }
    }
  }
</style>
