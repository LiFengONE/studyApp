import Vue from 'vue'
import app from '../App.vue'
import Router from 'vue-router'
import userCenter from '../components/userCenter.vue'
import myPosts from '../components/myPosts.vue'
import myCollection from '../components/myCollection.vue'
import myFans from '../components/myFans.vue'
import myFocus from '../components/myFocus.vue'
import index from '../components/index.vue'
import postContainer from '../components/postContainer.vue'
import postDetail from '../components/postDetail.vue'


Router.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1)
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: app,
      children : [
        {
          path:'',
          name:'index',
          component:index,
          redirect:'/post/离散',
          children:[
            {
              path: '/post/:tag',
              component: postContainer
            },
          ]
        },
        {
          path: '/thePost/:postId',
          component:postDetail
        },
        {
          path: '/user',
          name: 'user',
          component: userCenter,
        },
        {
          path: '/myPosts/:userEmail',
          component: myPosts
        },
        {
          path: '/myCollection/:userEmail',
          component: myCollection
        },
        {
          path: '/myFans/:userEmail',
          component: myFans
        },
        {
          path: '/myFocus/:userEmail',
          component: myFocus
        }
      ]
    },
  ],
  mode: 'history'
})
