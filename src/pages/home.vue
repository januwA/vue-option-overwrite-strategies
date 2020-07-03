<template>
  <div>
    <h1>home page</h1>
    <router-link to="/about">to about</router-link>
  </div>
</template>

<script>
import { mixin1, mixin2 } from "../mixins";
export default {
  mixins: [mixin1, mixin2],
  created() {
    console.log(this);
    console.log('home created');
    // this.$$super.created()
  },
  data() {
    return {
      name: 'home'
    };
  }
};
</script>

<style>
</style>