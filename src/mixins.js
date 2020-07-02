const superMixin1 = {
  mounted() {
    console.log("superMixin1");
  },
};

export const mixin1 = {
  mixins: [superMixin1],
  mounted() {
    console.log("mixin1");
  },
};

export const mixin2 = {
  mounted() {
    console.log("mixin2");
  },
  created() {
    console.log("mixin1 create");
  },
};