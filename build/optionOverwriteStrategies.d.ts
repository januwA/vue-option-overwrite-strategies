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
/**
 * 选项覆盖策略
 * 将vue的合并策略改为覆盖策略
 */
export declare function optionOverwriteStrategies(optionMergeStrategies: IoptionMergeStrategies, cfg?: Icfg): void;
/**
 * 不要excludes相关的
 * @param optionMergeStrategies
 * @param excludes
 */
export declare function handleExcludes(optionMergeStrategies: IoptionMergeStrategies, excludes: string[]): string[];
export declare function handleIncludes(optionMergeStrategies: IoptionMergeStrategies, includes: string[]): string[];
/**
 * Overwrite
 * @param optionMergeStrategies
 * @param hookName
 */
export declare function handleOverwrite(optionMergeStrategies: IoptionMergeStrategies, hookName: string): void;
