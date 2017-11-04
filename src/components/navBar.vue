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
        allTheme : []
      }
    },
    methods:{
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
    .allThemes{
      overflow-x: scroll;
      white-space:nowrap;
      font-size: 30px;
      line-height: 75px;
      span{
        width: 100px;
        margin-left: 15px;
      }
    }
  }
</style>
