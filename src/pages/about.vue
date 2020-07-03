<template>
  <div>
    <h1>about page</h1>
    <router-link to="/">to home</router-link>
  </div>
</template>

<script>
import { mixin1, mixin2 } from "../mixins";
export default {
  name: 'about',
  mixins: [mixin1, mixin2],
  created() {
    this.$$super.created()
    console.log('created');
  },
  data() {
    return {}
  }
}
</script>

<style>

</style>