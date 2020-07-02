export interface IoptionMergeStrategiesItem {
    (...args: any[]): any;
}
export interface IoptionMergeStrategies {
    [key: string]: IoptionMergeStrategiesItem;
}
/**
 * 将[includes]中的钩子从合并策略改为覆盖策略
 * @param optionMergeStrategies Vue.config.optionMergeStrategies
 * @param includes 需要修改的钩子，有些钩子无法处理
 */
export declare function optionOverwriteStrategies(optionMergeStrategies: IoptionMergeStrategies, includes: string[]): void;
/**
 * Overwrite
 * @param optionMergeStrategies
 * @param hookName
 */
export declare function handleOverwrite(optionMergeStrategies: IoptionMergeStrategies, hookName: string): void;
