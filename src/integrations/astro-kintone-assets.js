import fs from 'node:fs'
import path from 'node:path'
//import { loadEnv } from 'vite'
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Buffer } from 'node:buffer';

function downloadKintoneAssets() {
    return {
        name: 'download-kintone-assets',
        hooks: {
            'astro:build:start': async () => {
                //const env = loadEnv(import.meta.env.MODE, process.cwd(), '');
                const dir = 'public/downloads';
                if (!fs.existsSync(dir)) {
                    await fs.promises.mkdir(dir);
                }
                const client = new KintoneRestAPIClient({
                    baseUrl: 'https://2zb3bybyeov2.cybozu.com',
                    auth: {
                        apiToken: '3bYDyfTJyl7WSyLgWEEWRzErGyPLaocUPiAHXGjQ'
                    }
                });
                const response = await client.record.getRecords({app: 2})
                const fileRecords = response.records;

                fileRecords.forEach(async (x) => {
                    if (!x.File.value[0]) return;
                    const meta = x.File.value[0];
                    const data = await client.file.downloadFile({ fileKey: meta.fileKey })
                    const finalPath = path.join(dir, meta.name)
                    await fs.promises.writeFile(finalPath, Buffer.from(data));
                })
            }
        }
    }
}

export default downloadKintoneAssets;