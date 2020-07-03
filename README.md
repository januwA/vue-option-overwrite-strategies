## 将vue的合并策略改为覆写策略，只处理生命周期钩子

> 如果覆写了钩子，那么必须使用`this.$$super.<hook name>()`手动触发(如果你需要的话)

> 如果没有覆写那么会自动执行继承的钩子，就和vue自带的合并策略一样

## Install
```
npm i vue-option-overwrite-strategies
```

## Example

1. main.js中使用
```
import App from "./app.vue";
import { OptionOverwriteStrategies } from "vue-option-overwrite-strategies";

Vue.use(OptionOverwriteStrategies, ["created"]);
```

2. 组件
```
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
    this.$$super.mounted()
  }
};
```

3. mixins
```
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
```

4. 打印结果
```
mixin1 create
widget mounted
superMixin1
mixin1
mixin2
```

## dev
> $ npm start

## build
> $ npm run build


## See also:
- https://webpack.js.org/
- https://www.webpackjs.com/
- https://cn.vuejs.org/v2/api/index.html#optionMergeStrategies
- https://cn.vuejs.org/v2/guide/mixins.html