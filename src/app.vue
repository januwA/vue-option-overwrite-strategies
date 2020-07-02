<template>
  <div></div>
</template>

<script>
import { mixin1, mixin2 } from "./mixins";
export default {
  name: "app",
  mixins: [mixin1, mixin2],
  data() {
    return {
      name: 'app'
    };
  },
  created() {
    this.$$super.created();
    console.log('created');
  }
};
</script>

<style></style>
