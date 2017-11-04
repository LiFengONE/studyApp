<template>
  <div class="postContainer" @click="closeUserCenter">
    <outerPost v-for="(post , index) in posts" :key="index" :post="post" class="outerPost"></outerPost>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
     加载中...
    </div>
  </div>
</template>
<script>
  import outerPost from '../components/outerPost.vue'
  import axios from 'axios'
  export default {
    components: {
      outerPost,
    },
    name: 'postContainer',
    data() {
      return {
        posts : [],
        tag:'',
        page:1,
        pageSize:4,
        busy:true,
        flag:true
      }
    },
    computed : {
      publishPostSuccess () {
        return this.$store.state.publishPostSuccess
      }
    },
    methods : {
      getPosts:function (flag) {
        let self = this;
        let params = {
          tag:this.tag,
          page:this.page,
          pageSize:this.pageSize
        };
        axios.get('/api/posts/',{
          params:params
        })
          .then(function (res) {
            if(flag){
              self.posts = self.posts.concat(res.data);
              if(res.data.length < self.pageSize){
                self.busy = true;
              }else {
                self.busy = false;
              }
            }else {
              self.posts = res.data;
              self.busy = false;
            }
          })
      },
      getHotPosts(flag){
        let self = this;
        let params = {
          page:this.page,
          pageSize:this.pageSize
        };
        axios.get('/api/hotPosts',{
          params:params
        })
          .then(function (res) {
            if(flag){
              self.posts = self.posts.concat(res.data);
              if(res.data.length < self.pageSize){
                self.busy = true;
              }else {
                self.busy = false;
              }
            }else {
              self.posts = res.data;
              self.busy = false;
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      closeUserCenter(){
        if(this.$store.state.inUserCenter){
          this.$store.state.inUserCenter = false;
        }
        if(this.$store.state.inSearching){
          this.$store.state.inSearching = false;
        }
      },
      loadMore(){
        if(this.flag){
          this.flag = false;
          this.busy = true;
          setTimeout(() => {
            this.page ++;
            this.getPosts(true);
            if(this.tag === '热门'){
              this.getHotPosts(true);
            }else {
              this.getPosts(true);
            }
            this.busy = false;
          }, 5000);
          this.flag = true;
        }
      }
    },
    mounted(){
      this.tag = this.$route.params.tag;
      this.posts = [];
      this.page = 1;
      this.getPosts(false);
      if(this.tag === '热门'){
        this.getHotPosts(false);
      }else {
        this.getPosts(false);
      }
    },
    watch : {
      "$route" : function () {
        this.tag = this.$route.params.tag;
        this.posts = [];
        this.page = 1;
        this.getPosts(false);
        if(this.tag === '热门'){
          this.getHotPosts(false);
        }else {
          this.getPosts(false);
        }
      },
      publishPostSuccess : function () {
        this.posts = [];
        this.page = 1;
        //this.getPosts(false);
        if(this.tag === '热门'){
          this.getHotPosts(false);
        }else {
          this.getPosts(false);
        }
      }
    }
  }
</script>
<style lang="scss" scoped="">
  .postContainer{
    background-color: #b9b0b1;
  }
  .outerPost{
    margin-bottom:15px;
  }
</style>
