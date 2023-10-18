"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticPlugin = void 0;
const elysia_1 = require("elysia");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const listFiles = async (dir) => {
    const files = await (0, promises_1.readdir)(dir);
    const all = await Promise.all(files.map(async (name) => {
        const file = dir + '/' + name;
        const stats = await (0, promises_1.stat)(file);
        return stats && stats.isDirectory()
            ? await listFiles(file)
            : [(0, path_1.resolve)(dir, file)];
    }));
    return all.flat();
};
const staticPlugin = async ({ assets = 'public', prefix = '/public', staticLimit = 1024, alwaysStatic = false, ignorePatterns = ['.DS_Store', '.git', '.env'], noExtension = false, enableDecodeURI = false, resolve = path_1.resolve, headers = {} } = {
    assets: 'public',
    prefix: '/public',
    staticLimit: 1024,
    alwaysStatic: process.env.NODE_ENV === 'production',
    ignorePatterns: [],
    noExtension: false,
    enableDecodeURI: false,
    resolve: path_1.resolve,
    headers: {}
}) => {
    const files = await listFiles((0, path_1.resolve)(assets));
    if (prefix === '/')
        prefix = '';
    const shouldIgnore = (file) => {
        if (!ignorePatterns.length)
            return false;
        return ignorePatterns.find((pattern) => {
            if (typeof pattern === 'string')
                return pattern.includes(file);
            else
                return pattern.test(file);
        });
    };
    const app = new elysia_1.Elysia({
        name: 'static',
        seed: {
            assets,
            prefix,
            staticLimit,
            alwaysStatic,
            ignorePatterns,
            noExtension,
            resolve: resolve.toString()
        }
    });
    if (alwaysStatic ||
        (process.env.ENV === 'production' && files.length <= staticLimit))
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file || shouldIgnore(file))
                continue;
            const response = Object.keys(headers).length
                ? () => new Response(Bun.file(file), {
                    headers
                })
                : () => new Response(Bun.file(file));
            let fileName = file.replace(resolve(), '').replace(`${assets}/`, '');
            if (noExtension) {
                const temp = fileName.split('.');
                temp.splice(-1);
                fileName = temp.join('.');
            }
            app.get((0, path_1.join)(prefix, fileName), response);
        }
    else {
        if (!app.routes.find(({ method, path }) => path === `${prefix}/*` && method === 'GET'))
            app.onError(() => { }).get(`${prefix}/*`, async ({ params }) => {
                const file = enableDecodeURI ? decodeURI(`${assets}/${decodeURI(params['*'])}`) : `${assets}/${params['*']}`;
                if (shouldIgnore(file))
                    throw new elysia_1.NotFoundError();
                return (0, promises_1.stat)(file)
                    .then((status) => new Response(Bun.file(file), {
                    headers
                }))
                    .catch((error) => {
                    throw new elysia_1.NotFoundError();
                });
            });
    }
    return app;
};
exports.staticPlugin = staticPlugin;
exports.default = exports.staticPlugin;
