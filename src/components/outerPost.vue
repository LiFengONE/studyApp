<template>
  <div class="postOut">
    <div class="postDiv">
      <div class="postHeader">
        <div class="title">
          <router-link :to="{path:'/thePost/' + post._id}">
            {{post.title}}
          </router-link>
        </div>
        <div class="time">{{publishedTime}}</div>
      </div>
      <div class="tags">
        <span v-for="(tag , index) in post.tags" :key="index">
          <router-link :to="{path:'/post/' + tag}">
            {{tag}}
          </router-link>
        </span>
      </div>
      <div class="content">{{post.content}}</div>
      <div class="postFooter">
        <div class="author">{{post.authorEmail}}</div>
        <div class="praiseNum">{{post.commentNum}}评</div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import UserCenter from "./userCenter.vue";
  import moment from 'moment'
  moment.locale(['zh-cn', 'zh-tw']);
  //import MuFlatButton from "../../node_modules/muse-ui/src/flatButton/flatButton.vue";
  export default {
   //components: {MuFlatButton},
    components: {UserCenter},
    name: 'outerPost',
    data(){
      return {
        //post :{},
        time:'',
      }
    },
    computed:{
      publishedTime(){
        return moment(this.post.publishedTime, "YYYY-MM-DD-HH-mm-ss").fromNow();
      }
    },
    props:['post'],
    methods : {

    },
    mounted(){
    }
  }
</script >
<style lang="scss" scoped>
  .postOut{
    background-color: white;
    width: 100%;
    box-sizing: border-box;
    .postDiv{
      height: 320px;
      padding: 15px;
      .postHeader{
        display: flex;
        justify-content: space-around;
        .title{
          flex: 3;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 40px;
        }
        .time{
          flex: 1;
          font-size: 25px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }
      }
      .tags{
        margin-left: 3px;
        margin-top: 3px;
        span{
          background-color: #92b8b4;
          padding: 5px;
          font-size: 20px;
          border-radius: 15px;
          margin-right: 5px;
        }
        a {
          color:black;
        }
      }
      .content{
        margin-top: 5px;
        font-size: 30px;
        height: 140px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-indent:2em;
      }
      .postFooter{
        display: flex;
        justify-content: space-between;
        .author{
          padding: 10px;
          font-size: 20px;
        }
        .praiseNum{
          padding: 10px;
          font-size: 20px;
        }
      }
      .title{
        font-size: 25px;
        a {
          color: black;
        }
      }
    }
  }
</style>
