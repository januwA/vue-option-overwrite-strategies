import _Vue from "vue";
export interface IoptionMergeStrategiesItem {
    (...args: any[]): any;
}
export interface IoptionMergeStrategies {
    [key: string]: IoptionMergeStrategiesItem;
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
export declare class OptionOverwriteStrategies {
    static install(Vue: typeof _Vue, options: string[]): void;
}
