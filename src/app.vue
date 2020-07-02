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
  mounted() {
    console.log('widget mounted');
    // this.$$super.mounted()
  }
};
</script>

<style></style>
