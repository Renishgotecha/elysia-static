import { Elysia } from 'elysia';
export declare const staticPlugin: <Prefix extends string = "/prefix">({ assets, prefix, staticLimit, alwaysStatic, ignorePatterns, noExtension, enableDecodeURI, resolve, headers }?: {
    /**
     * @default "public"
     *
     * Asset path to expose as public path
     */
    assets?: string | undefined;
    /**
     * @default '/public'
     *
     * Path prefix to create virtual mount path for the static directory
     */
    prefix?: Prefix | undefined;
    /**
     * @default 1024
     *
     * If total files exceed this number,
     * file will be handled via wildcard instead of static route
     * to reduce memory usage
     */
    staticLimit?: number | undefined;
    /**
     * @default false
     *
     * If set to true, file will always use static path instead
     */
    alwaysStatic?: boolean | undefined;
    /**
     * @default [] `Array<string | RegExp>`
     *
     * Array of file to ignore publication.
     * If one of the patters is matched,
     * file will not be exposed.
     */
    ignorePatterns?: (string | RegExp)[] | undefined;
    /**
     * Indicate if file extension is required
     *
     * Only works if `alwaysStatic` is set to true
     */
    noExtension?: boolean | undefined;
    /**
     *
     * When url needs to be decoded
     *
     * Only works if `alwaysStatic` is set to false
     */
    enableDecodeURI?: boolean | undefined;
    /**
     * Nodejs resolve function
     */
    resolve?: ((...pathSegments: string[]) => string) | undefined;
    /**
     * Set headers
     */
    headers?: Record<string, string> | undefined;
}) => Promise<Elysia<"", {
    request: {};
    store: {};
}, {
    type: {};
    error: {};
}, {}, {}, false>>;
export default staticPlugin;
