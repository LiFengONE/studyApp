<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    components: {
    },
    name: 'app',
    data() {
      return {
        transitionName: 'slide-left'
      }
    },
    beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack;
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false;
      next()
    }
  }
</script>
<style lang="scss" scoped>
  body {
    margin: 0;
  }
</style>
