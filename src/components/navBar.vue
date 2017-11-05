<template>
  <div class="wrapper" ref="theWrapper" @click="closeUserCenter">
    <div class="allThemes">
      <div>
        <span v-for="(theme , index) in allTheme" :key="index">
          <router-link :to="{path:'/post/' + theme}">
            {{theme}}
          </router-link>
        </span>
        <!--<router-link :to="{path:'/post'}">-->
          <!--<span v-for="{theme,index} in allTheme" :key="index">{{theme}}</span>-->
        <!--</router-link>-->
      </div>
    </div>
    <div class="addTheme" @click="openDialog"> + </div>
    <mu-dialog :open="dialog" title="新增分类" @close="closeDialog">
      <form class="form-horizontal" @submit.prevent="addTheme">
        <div class="form-group">
          <label for="theme" class="col-sm-2 control-label">分类</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="theme" v-model="newTheme.name" placeholder="分类名称" required>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-default">发布</button>
          </div>
        </div>
      </form>
    </mu-dialog>
    <!--<router-view ></router-view>-->
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'navBar',
    components: {
    },

    data(){
      return {
        allTheme : [],
        newTheme:{},
        dialog:false
      }
    },
    methods:{
      closeDialog(){
        this.dialog = false;
      },
      openDialog(){
        if(this.$store.state.isSignIn){
          this.dialog = true;
        }else {
          alert('请先登录')
        }
      },
      getAllTheme : function () {
        let self = this;
        axios.get('/api/themes').then(function (res) {
          for(let theme of res.data) {
            self.allTheme.push(theme.name);
          }
        })
      },
      closeUserCenter(){
        if(this.$store.state.inUserCenter){
          this.$store.state.inUserCenter = false;
        }
      },
      addTheme(){
        let self = this;
        axios.post('/api/theme',self.newTheme)
          .then(function (res) {
            alert('发布成功');
            self.closeDialog();
            self.getAllTheme();
          })
          .catch(function (err) {
            alert('发布失败')
          })
      }
    },
    mounted() {
      this.getAllTheme();
    }
  }
</script>
<style lang="scss" scoped>
  a{
    color: white;
    text-decoraction: none;
  }
  .router-link-active {
    text-decoration: none;
    color: #74b7ff;
  }
  .wrapper{
    background-color: #0bb882;
    width: 100%;
    height: 75px;
    overflow:hidden;
    display: flex;
    .allThemes{
      overflow-x: scroll;
      white-space:nowrap;
      font-size: 30px;
      line-height: 75px;
      div{
        margin-left: 15px;
      }
    }
    .addTheme{
      width: 50px;
      color: #5bc0de;
      padding-left: 10px;
      padding-right: 5px;
      font-size: 60px;
      line-height: 75px;
    }
  }
</style>
