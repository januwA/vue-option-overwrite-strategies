/**
 * uniapp函数钩子
 */
const UNIAPP_HOOKS = [
  "onLaunch",
  "onShow",
  "onHide",
  "onError",
  "onUniNViewMessage",
  "onLoad",
  "onShow",
  "onReady",
  "onHide",
  "onUnload",
  "onResize",
  "onPullDownRefresh",
  "onReachBottom",
  "onTabItemTap",
  "onShareAppMessage",
  "onPageScroll",
  "onNavigationBarButtonTap",
  "onBackPress",
  "onNavigationBarSearchInputChanged",
  "onNavigationBarSearchInputConfirmed",
  "onNavigationBarSearchInputClicked",
];

/**
 * 默认只处理这些钩子
 * https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90
 */
const DEFAULT_INCLUDES = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "activated",
  "deactivated",
  "beforeDestroy",
  "destroyed",
  "errorCaptured",
  ...UNIAPP_HOOKS,
];

const SUPER_OPTION_NAME = "$$super";

export interface Icfg {
  /**
   * 处理指定钩子
   */
  includes?: string[];

  /**
   * 跳过处理指定钩子
   */
  excludes?: string[];
}

export interface IoptionMergeStrategiesItem {
  (...args: any[]): any;
}

export interface IoptionMergeStrategies {
  [key: string]: IoptionMergeStrategiesItem;
}

function dedupeHooks(hooks: Function | Function[]) {
  if (!Array.isArray(hooks)) return [hooks];
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

/**
 * 选项覆盖策略
 * 将vue的合并策略改为覆盖策略
 */
export function optionOverwriteStrategies(
  optionMergeStrategies: IoptionMergeStrategies,
  cfg?: Icfg
): void {
  const { includes = [], excludes = [] } = cfg ?? {};
  if (includes.length && excludes.length) {
    throw new Error("includes和excludes不能同时存在.");
  }
  const lifecycleHooks: string[] = handleIncludes(
    optionMergeStrategies,
    DEFAULT_INCLUDES
  );

  // 指定处理
  if (includes.length) {
    return lifecycleHooks
      .filter((it) => includes.includes(it))
      .forEach((it) => handleOverwrite(optionMergeStrategies, it));
  }

  // 指定跳过
  if (excludes.length) {
    return lifecycleHooks
      .filter((it) => !excludes.includes(it))
      .forEach((it) => handleOverwrite(optionMergeStrategies, it));
  }

  // 处理全部
  const isHandleAll = !excludes.length && !includes.length;
  if (isHandleAll) {
    return lifecycleHooks.forEach((it) =>
      handleOverwrite(optionMergeStrategies, it)
    );
  }

  optionMergeStrategies[SUPER_OPTION_NAME] = function (
    superVal: any,
    val: any
  ) {
    return val;
  };
}

/**
 * 不要excludes相关的
 * @param optionMergeStrategies
 * @param excludes
 */
export function handleExcludes(
  optionMergeStrategies: IoptionMergeStrategies,
  excludes: string[]
): string[] {
  return Object.keys(optionMergeStrategies).filter(
    (it) => !excludes.includes(it)
  );
}

export function handleIncludes(
  optionMergeStrategies: IoptionMergeStrategies,
  includes: string[]
) {
  return Object.keys(optionMergeStrategies).filter((it) =>
    includes.includes(it)
  );
}

/**
 * Overwrite
 * @param optionMergeStrategies
 * @param hookName
 */
export function handleOverwrite(
  optionMergeStrategies: IoptionMergeStrategies,
  hookName: string
) {
  const cache: any[] = [];
  optionMergeStrategies[hookName] = function (superValues, val) {
    let res;
    if (val) {
      if (superValues) {
        res = (<any>superValues).concat(val);
      } else {
        res = Array.isArray(val) ? val : [val];
      }
    } else {
      res = superValues;
    }
    const result: any[] = res ? dedupeHooks(res) : res;
    const last = result.pop();

    // [mixin1, mixin2, widget]
    // 最后一个会自动执行
    cache.push(last);

    // 拦截
    const first = function (this: any /*Vue.Component*/) {
      const superLength = cache.length;
      const isOverwrite = cache[superLength - 1] !== cache[superLength - 2];
      cache.pop();
      if (!isOverwrite) cache.pop();
      if (!this[SUPER_OPTION_NAME]) this[SUPER_OPTION_NAME] = {};
      this[SUPER_OPTION_NAME][hookName] = () => {
        cache.forEach((superHook) => {
          superHook.call(this);
        });
      };
      if (!isOverwrite) this[SUPER_OPTION_NAME][hookName]();
    };

    return [first, last];
  };
}
