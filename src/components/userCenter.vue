<template>
  <div class="userDiv">
    <div class="userInfo">
      <div class="head">
        <div class="skin">
          <mu-icon value="local_library" :size="50"></mu-icon>
        </div>
        <div class="settings">
          <mu-icon value="brightness_high" :size="50" @click="openDialog"></mu-icon>
          <mu-dialog :open="dialog"  @close="closeDialog">
            <form class="form-horizontal" @submit.prevent="changeInfoSubmit">
              <div class="form-group">
                <label for="userName" class="col-sm-2 control-label">用户名</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="userName" v-model="userInfo.userName">
                </div>
              </div>
              <input type="radio" id="roleStudent" value="男" v-model="userInfo.gender" >
              <label for="roleStudent">男</label>
              <input type="radio" id="roleTeacher" value="女" v-model="userInfo.gender" >
              <label for="roleTeacher">女</label>
              <span>Picker:{{userInfo.gender}}</span>
              <div class="form-group">
                <label for="age" class="col-sm-2 control-label">年龄</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="age" v-model="userInfo.age">
                </div>
              </div>
              <div class="form-group">
                <label for="school" class="col-sm-2 control-label">学校</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="school" v-model="userInfo.school">
                </div>
              </div>
              <div class="form-group">
                <label for="major" class="col-sm-2 control-label">专业</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="major" v-model="userInfo.major">
                </div>
              </div>
              <div class="form-group">
                <label for="grade" class="col-sm-2 control-label">年级</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="grade" v-model="userInfo.grade">
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                  <button type="submit" class="btn btn-default">修改</button>
                </div>
              </div>
            </form>
          </mu-dialog>
        </div>

      </div>
      <div class="userPic">
        <mu-avatar slot="left" color="#fff37" backgroundColor="#9*3FFF37" :size="200">{{userInfo.userName}}</mu-avatar>
      </div>
      <div class="name">{{userInfo.userName}}</div>
      <div class="ageAndSex">
        <div class="age">{{userInfo.age}}</div>
        <div class="sex">{{userInfo.gender}}</div>
      </div>
      <div class="stuInfo">
        <div class="school">{{userInfo.school}}</div>
        <div class="major">{{userInfo.major}}</div>
        <div class="grade">{{userInfo.grade}}</div>
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
        dialog:false
      }
    },
    computed : {
      userInfo(){
        return {...this.$store.state.userInfo}
      }
    },
    methods : {
      openDialog(){
        this.dialog = true;
      },
      closeDialog(){
        this.dialog = false;
      },
      changeInfoSubmit(){
        let self = this;
        axios.put('/api/user',self.userInfo)
          .then(function (res) {
            alert('修改成功')
          })
          .catch(function (err) {
            console.log(err);
          })
      },
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
    height: 100vh;
    width: 100%;
    border: solid 1px red;
    .userInfo{
      display: flex;
      width: 100%;
      height: 40vh;
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
        margin-top: 10px;
      }
      .userPic{
        font-size: 50px;
      }
      .name{
        font-size: 30px;
        margin-top: 20px;
      }
      .ageAndSex{
        display: flex;
        justify-content: space-around;
        width: 50%;
        font-size: 30px;
        margin-top: 20px;
      }
      .stuInfo{
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        font-size: 25px;
        width: 100%;
      }
    }
    .userInform{
      padding-top: 55px;
      background-color: #032926;
      display: flex;
      flex-direction: column;
      //justify-content: space-around;
      height: 45vh;
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
