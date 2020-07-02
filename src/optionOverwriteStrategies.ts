const SUPER_OPTION_NAME = "$$super";

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
  * 将[includes]中的钩子从合并策略改为覆盖策略
  * @param optionMergeStrategies Vue.config.optionMergeStrategies
  * @param includes 需要修改的钩子，有些钩子无法处理
  */
export function optionOverwriteStrategies(
  optionMergeStrategies: IoptionMergeStrategies,
  includes: string[]
): void {
  if (!includes.length) return;

  // 只处理指定的钩子，如果不能能处理自动抛出错误
  // !通常只能处理函数钩子

  for (const hHook of includes) {
    // 提供了无效的hook直接跳过
    if (hHook in optionMergeStrategies) {
      handleOverwrite(optionMergeStrategies, hHook);
    }
  }

  optionMergeStrategies[SUPER_OPTION_NAME] = function (
    superVal: any,
    val: any
  ) {
    return val;
  };
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
