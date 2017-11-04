<template>
  <div>
    <div class="publish" @click="openPublishDialog">
      <span class="glyphicon glyphicon-pencil"></span>
    </div>
    <mu-dialog :open="publishDialog" title="我要提问" @close="closePublishDialog">
      <form class="form-horizontal" @submit.prevent="publishPost">
        <div class="form-group">
          <label for="postTitle" class="col-sm-2 control-label">标题</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="postTitle" v-model="postInfo.title" placeholder="Title" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">标签</label>
          <div class="col-sm-10">
            <label class="checkbox-inline" v-for="(theme , index) in allTheme" :key="index">
              <input type="checkbox" id="inlineCheckbox1" :value="theme" v-model="postInfo.tags"> {{theme}}
            </label>
          </div>
        </div>
        <span>Checked names: {{ postInfo.tags }}</span>
        <div class="form-group">
          <label for="postContent" class="col-sm-2 control-label">问题</label>
          <div class="col-sm-10">
            <textarea class="form-control" id="postContent" v-model="postInfo.content" placeholder="Content" required></textarea>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-default">发表</button>
          </div>
        </div>
      </form>
    </mu-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  moment.locale(['zh-cn', 'zh-tw']);
  export default {
    components: {
    },
    name: 'publishPost',
    data() {
      return {
        publishDialog:false,
        postInfo:{
          title:'',
          tags:[],
          publishedTime:'',
          content:'',
          authorEmail:''
        },
        allTheme:[]
      }
    },
    methods:{
      publishPost(){
        let self = this;
        this.postInfo.authorEmail = this.$store.state.userEmail;
        this.postInfo.publishedTime = moment().format("YYYY-MM-DD-HH-mm-ss");
        axios.post('/api/post',this.postInfo)
          .then(function (res) {
            alert('发表成功');
            self.closePublishDialog();
            self.$store.state.publishPostSuccess = ! self.$store.state.publishPostSuccess;
          })
          .catch(function (err) {
            alert('发表失败')
          })
      },
      openPublishDialog () {
        if(this.$store.state.isSignIn){
          this.publishDialog = true
        }else {
          alert('请先登录');
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
      closePublishDialog(){
        this.publishDialog = false;
      }
    },
    mounted(){
      this.getAllTheme();
    }
  }
</script>

<style lang="scss" scoped>
  .publish{
    width: 150px;
    height: 150px;
    font-size: 80px;
    position: fixed;
    right: 10px;
    bottom: 200px;

  }
</style>
