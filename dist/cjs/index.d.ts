import { Elysia } from 'elysia';
export declare const staticPlugin: <Prefix extends string = "/prefix">({ assets, prefix, staticLimit, alwaysStatic, ignorePatterns, noExtension, enableDecodeURI, resolve, headers }?: {
    assets?: string | undefined;
    prefix?: Prefix | undefined;
    staticLimit?: number | undefined;
    alwaysStatic?: boolean | undefined;
    ignorePatterns?: (string | RegExp)[] | undefined;
    noExtension?: boolean | undefined;
    enableDecodeURI?: boolean | undefined;
    resolve?: ((...pathSegments: string[]) => string) | undefined;
    headers?: Record<string, string> | undefined;
}) => Promise<Elysia<"", {
    request: {};
    store: {};
}, {
    type: {};
    error: {};
}, {}, {}, false>>;
export default staticPlugin;
