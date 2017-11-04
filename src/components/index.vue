<template>
  <div class="first">
    <div class="user" v-show="isInUserCenter">
      <user-center></user-center>
    </div>
    <div class="index">
      <header-div></header-div>
      <navBar></navBar>
      <publishPost></publishPost>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import headerDiv from '../components/headerDiv.vue'
  import navBar from '../components/navBar.vue'
  import userCenter from '../components/userCenter.vue'
  import outerPost from '../components/outerPost.vue'
  import postContainer from '../components/postContainer.vue'
  import publishPost from '../components/publishPost.vue'
  import axios from 'axios'
  export default {
    components: {
      headerDiv,
      navBar,
      outerPost,
      userCenter,
      postContainer,
      publishPost
    },
    name: 'index',
    data() {
      return {

      }
    },
    computed:{
      isInUserCenter(){
        return this.$store.state.inUserCenter;
      },
    },
    methods:{
//
    }
  }
</script>
<style lang="scss" scoped>
  .first{
    display: flex;
    width: 100%;
    .user{
      //display: inline-block;
      width: 60%;
    }
    .index{
      flex: 1;
      width: 40%;
      //display: inline-block;
    }
  }
</style>
