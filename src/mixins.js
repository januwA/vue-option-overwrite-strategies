export const mixin1 = {
  created() {
    console.log("mixin1 created");
  },
  mounted() {
    console.log("mixin1");
  },
};

export const mixin2 = {
  mounted() {
    console.log("mixin2");
  },
};
