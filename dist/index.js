import { NotFoundError, Elysia } from 'elysia';
import { readdir, stat } from 'fs/promises';
import { resolve, resolve as resolveFn, join } from 'path';
const listFiles = async (dir) => {
    const files = await readdir(dir);
    const all = await Promise.all(files.map(async (name) => {
        const file = dir + '/' + name;
        const stats = await stat(file);
        return stats && stats.isDirectory()
            ? await listFiles(file)
            : [resolve(dir, file)];
    }));
    return all.flat();
};
export const staticPlugin = async ({ assets = 'public', prefix = '/public', staticLimit = 1024, alwaysStatic = false, ignorePatterns = ['.DS_Store', '.git', '.env'], noExtension = false, enableDecodeURI = false, resolve = resolveFn, headers = {} } = {
    assets: 'public',
    prefix: '/public',
    staticLimit: 1024,
    alwaysStatic: process.env.NODE_ENV === 'production',
    ignorePatterns: [],
    noExtension: false,
    enableDecodeURI: false,
    resolve: resolveFn,
    headers: {}
}) => {
    const files = await listFiles(resolveFn(assets));
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
    const app = new Elysia({
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
            app.get(join(prefix, fileName), response);
        }
    else {
        if (
        // @ts-ignore
        !app.routes.find(({ method, path }) => path === `${prefix}/*` && method === 'GET'))
            app.onError(() => { }).get(`${prefix}/*`, async ({ params }) => {
                const file = enableDecodeURI ? decodeURI(`${assets}/${decodeURI(params['*'])}`) : `${assets}/${params['*']}`;
                if (shouldIgnore(file))
                    throw new NotFoundError();
                return stat(file)
                    .then((status) => new Response(Bun.file(file), {
                    headers
                }))
                    .catch((error) => {
                    throw new NotFoundError();
                });
            });
    }
    return app;
};
export default staticPlugin;
