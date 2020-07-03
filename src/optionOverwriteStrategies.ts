import _Vue from "vue";

const SUPER_OPTION_NAME = "$$super";

export interface IoptionMergeStrategiesItem {
  (...args: any[]): any;
}

export interface IoptionMergeStrategies {
  [key: string]: IoptionMergeStrategiesItem;
}

/**
 * 去重
 * @param proxyHooks
 */
function _dedupeHooks(proxyHooks: Function[]) {
  const res = [];
  for (let i = 0; i < proxyHooks.length; i++) {
    if (res.indexOf(proxyHooks[i]) === -1) {
      res.push(proxyHooks[i]);
    }
  }
  return res;
}

/**
 * 是否覆写
 * @param proxyHooks
 */
function _isOverwrite(proxyHooks: any[]) {
  return (
    proxyHooks[proxyHooks.length - 1] !== proxyHooks[proxyHooks.length - 2]
  );
}

function _isFunction(val: any) {
  return val && typeof val === "function";
}

function _callProxyHooks(hooks: Function[], context: any) {
  hooks.forEach((proxySuperhook) => proxySuperhook.call(context, true));
}

function _proxyHook(hook: Function, dhook: Function) {
  return function proxyHook(this: any, run?: boolean) {
    // 没有覆写自动执行
    // run 手动执行
    if (!dhook.prototype.isOverwrite || run === true) {
      if (_isFunction(hook)) hook.call(this);
    }
  };
}

/**
 * 将[includes]中的钩子从合并策略改为覆盖策略
 * @param optionMergeStrategies Vue.config.optionMergeStrategies
 * @param includes 需要修改的钩子，有些钩子无法处理
 */
function optionOverwriteStrategies(
  optionMergeStrategies: IoptionMergeStrategies,
  includes: string[]
): void {
  if (!Array.isArray(includes) || !includes.length) return;

  // 只处理指定的钩子，如果不能能处理自动抛出错误
  // !通常[vue-option-overwrite-strategies]只能处理函数钩子

  for (const hHook of includes) {
    // 提供了无效的hook直接跳过
    if (hHook in optionMergeStrategies) {
      handleOverwrite(optionMergeStrategies, hHook);
    }
  }
}

/**
 * Overwrite
 * @param optionMergeStrategies
 * @param hookName
 */
function handleOverwrite(
  optionMergeStrategies: IoptionMergeStrategies,
  hookName: string
) {
  // 所有混入检测完成，这些hook才会被调用
  // 默认拦截器，在所有之前
  function defaultHook(this: any /*Vue.Component*/) {
    const hooks = defaultHook.prototype.hooks;
    const isOverwrite = defaultHook.prototype.isOverwrite;

    // 创建$$super对象
    if (!this[SUPER_OPTION_NAME]) this[SUPER_OPTION_NAME] = {};

    // 覆写去掉第一个当前这个函数,去掉最后一个覆写函数，免递归调用
    // 没有覆写，去掉第一个当前这个函数,自动执行所有super
    const superHooks = isOverwrite
      ? hooks.slice(1, hooks.length - 1)
      : hooks.slice(1, hooks.length);

    this[SUPER_OPTION_NAME][hookName] = () => {
      _callProxyHooks(superHooks, this);
    };

    if (isOverwrite) {
      // 覆写,自动调用覆写hook
      const overwriteHook = hooks[hooks.length - 1];
      overwriteHook.call(this, true);
    } else {
      // 没有覆写，调用所有super hook
      // 已经交给[_proxyHook]处理
    }
  }
  optionMergeStrategies[hookName] = createOverwriteStrategies(defaultHook);
}

/**
 * 创建策略
 * @param defaultHook
 */
function createOverwriteStrategies(defaultHook: Function) {
  return function (superValues: any, val: any) {
    if (superValues) {
      // not first
      if (val) {
        // 混入，并实现[hookName]
        superValues.push(_proxyHook(val, defaultHook));
      } else {
        // 混入，但并未实现[hookName]
        // 如果没有实现就将前一个hook追加到尾部，这样才能判断是否重写
        superValues.push(superValues[superValues.length - 1]);
      }

      // 先判断是否重写，在去重
      defaultHook.prototype.isOverwrite = _isOverwrite(superValues);
      defaultHook.prototype.hooks = _dedupeHooks(superValues);
      return defaultHook.prototype.hooks;
    } else {
      // first
      const r = [defaultHook, _proxyHook(val, defaultHook)];
      defaultHook.prototype.hooks = r;
      return r;
    }
  };
}

/**
 * 插件的方式
 *
 * ```
 * import { OptionOverwriteStrategies } from "vue-option-overwrite-strategies";
 * Vue.use(OptionOverwriteStrategies, ["created"]);
 * ```
 * 
 * https://cn.vuejs.org/v2/guide/plugins.html
 */
export class OptionOverwriteStrategies {
  static install(Vue: typeof _Vue, options: string[]) {
    optionOverwriteStrategies(Vue.config.optionMergeStrategies, options);
  }
}
