<template>
  <div id="headerDiv">
    <template v-if="inSearching">
      <div class="searchInput">
        <mu-auto-complete hintText="请随便输入点啥" @input="handleInput" :dataSource="dataSource" @change="handleChange" ></mu-auto-complete>
      </div>
    </template>
    <template v-else>
      <div id="userCenter">
        <template v-if="isSignIn">
          <div class="userPicture" @click="openUserCenter">
            <mu-avatar slot="left" color="#fff37" backgroundColor="#9*3FFF37" :size="50">{{userName.split('')[0]}}</mu-avatar>
      </div>
        </template>
        <template v-else>
          <mu-flat-button class="demo-flat-button sign" @click="openDialog">登录/注册</mu-flat-button>
          <mu-dialog :open="dialog"  @close="closeDialog">
            <mu-tabs :value="activeTab" @change="handleTabChange" class="myTabs">
              <mu-tab value="signIn" title="登录" class="myTab"></mu-tab>
              <mu-tab value="signUp" title="注册" class="myTab"></mu-tab>
            </mu-tabs>
            <div v-if="activeTab === 'signIn'">
              <form class="form-horizontal" @submit.prevent="signInSubmit">
                <div class="form-group">
                  <label for="signInUserEmail" class="col-sm-2 control-label">Email</label>
                  <div class="col-sm-10">
                    <input type="email" class="form-control" id="signInUserEmail" v-model="signInUser.email" placeholder="Email" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="signInUserPassword" class="col-sm-2 control-label">Password</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="signInUserPassword" name="signInUserPassword" v-model="signInUser.password" placeholder="Password" required>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">Sign in</button>
                  </div>
                </div>
              </form>
            </div>
            <div v-if="activeTab === 'signUp'">
              <form class="form-horizontal" @submit.prevent="signUpSubmit">
                <div class="form-group">
                  <label for="signUpUserName" class="col-sm-2 control-label">用户名</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="signUpUserName" name="signUpUserName" v-model="signUpUser.userName" placeholder="用户名">
                  </div>
                </div>
                <div class="form-group">
                  <label for="signUpUserEmail" class="col-sm-2 control-label">邮箱</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="signUpUserEmail" name="signUpUserEmail" v-model="signUpUser.email" placeholder="Email">
                  </div>
                </div>
                <div class="form-group">
                  <label for="signUpUserPassword" class="col-sm-2 control-label">密码</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="signUpUserPassword" name="signInUserPassword" v-model="signUpUser.password" placeholder="Password">
                  </div>
                </div>
                <div class="form-group">
                  <label for="signUpUserConfirmPassword" class="col-sm-2 control-label">确认密码</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="signUpUserConfirmPassword" name="signInUserPassword" v-model="signUpUser.confirmPassword" placeholder="Confirm Password">
                  </div>
                </div>
                <input type="radio" id="roleStudent" value="学生" v-model="signUpUser.role" >
                <label for="roleStudent">学生</label>
                <input type="radio" id="roleTeacher" value="教师" v-model="signUpUser.role" >
                <label for="roleTeacher">教师</label>
                <span>Picker:{{signUpUser.role}}</span>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">Sign Up</button>
                  </div>
                </div>
              </form>
            </div>
            <!--<mu-flat-button slot="actions" @click="closeDialog" primary label="取消"></mu-flat-button>-->
            <!--<mu-flat-button slot="actions" primary @click="closeDialog" label="确定"></mu-flat-button>-->
          </mu-dialog>
        </template>
      </div>
      <div id="appTitle">
        <span>良师益友</span>
      </div>
    </template>
    <div id="search" @click="searchClick">
      <span class="glyphicon glyphicon-search"></span>
    </div>
  </div>
</template>

<script>
  import UserCenter from "./userCenter.vue";
  import axios from "axios"
  export default {
    name: 'headerDiv',
    components: {
      UserCenter
    },
    data() {
      return {
        dialog: false,
        dataSource: [],
        activeTab:'signIn',
        signInUser:{
          email:'',
          password:''
        },
        signUpUser:{
          userName:'',
          email:'',
          password:'',
          confirmPassword:'',
          role:''
        },
        userName:''
      }
    },
    computed:{
      isSignIn(){
        return this.$store.state.isSignIn
      },
      inSearching(){
        return this.$store.state.inSearching
      }
    },
    methods : {
      openDialog(){
        this.dialog = true;
      },
      closeDialog(){
        this.dialog = false;
      },
      searchClick(){
        if(! this.inSearching){
          this.$store.state.inSearching = true;
        }
      },
      handleChange (val) {
        alert(`you choose ${val}`)
      },
      handleInput (val) {
        let self = this;
        axios.get('/api/searchPost/' + val)
          .then(function (res) {
            for(let post of res.data){
              self.dataSource.push(post.title);
            }
          })
          .catch(function (err) {
            console.log(err)
          });
      },
      signIn() {
        this.$store.state.isSignIn = true;
        //store.commit('setSign',true);
      },
      handleTabChange (val) {
        this.activeTab = val
      },
      signInSubmit(){
        let signInUser = this.signInUser;
        let self = this;
        axios.post('/api/signIn',signInUser)
          .then(function (res) {
            self.$store.state.userEmail = signInUser.email;
            self.$store.state.isSignIn = true;
            self.userName = res.data.user.userName;
            self.$store.state.userInfo = {...res.data.user};
            alert('登录成功');
            self.closeDialog()
          })
          .catch(function (err) {
            console.log(err);
            alert('登录失败');
          })
      },
      signUpSubmit(){
        let self = this;
        if(this.signUpUser.password === this.signUpUser.confirmPassword){
          axios.post('/api/signUp',this.signUpUser)
            .then(function (res) {
              console.log(res);
              if(res.data.msg === '注册成功!'){
                console.log(res);
                alert("注册成功");
                self.closeDialog();
              }else if(res.data.msg === "该邮箱已被注册！"){
                alert('该邮箱已被注册！')
              }
            })
        }else {
          alert('两次密码不一致');
        }
      },
      openUserCenter(){
        this.$store.state.inUserCenter = true;
      }
    },
    mounted(){
    }
  }
</script>

<style lang="scss" scoped>
  $headerBgColor: #13b89b;
  .myTabs{
    margin-bottom: 20px;
    .myTab{
      background-color: #13b89b;
    }
  }
  #headerDiv {
    background-color: $headerBgColor;
    width: 100%;
    height: 100px;
    font-size: 40px;
    display: flex;
    justify-content: space-around;
    .searchInput{
      margin-top: 13px;
      margin-left: 100px;
    }
    #userCenter {
      width: 90px;
      height: 90px;
      padding: 5px;
      display: flex;
      align-items: center;
      img{
        width: 90px;
        height: 90px;
      }
      .sign{
        padding-top: 20px;
        width: 120px;
        height: 50px;
        font-size: 25px;
      }
      .userPicture{
        margin-top: 35px;
        margin-bottom: 10px;
        width: 60px;
        height: 60px;
      }
    }
    #appTitle{
      display: flex;
      align-items: center;
    }
    #search{
      display: flex;
      align-items: center;
    }
  }
</style>
