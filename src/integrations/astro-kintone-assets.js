import fs from 'node:fs'
import path from 'node:path'
//import { loadEnv } from 'vite'
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Buffer } from 'node:buffer';

function downloadKintoneAssets({ baseUrl, apiToken, appId, assetDir }) {
    console.log(baseUrl)
    console.log(apiToken)
    return {
        name: 'download-kintone-assets',
        hooks: {
            'astro:build:start': async () => {
                if (!fs.existsSync(assetDir)) {
                    await fs.promises.mkdir(assetDir);
                }
                const client = new KintoneRestAPIClient({
                    baseUrl,
                    auth: { apiToken }
                });
                const response = await client.record.getRecords({ app: appId })
                const records = response.records;

                records.forEach(async (x) => {
                    if (!x.File.value[0]) return;
                    const meta = x.File.value[0];
                    const data = await client.file.downloadFile({ fileKey: meta.fileKey })
                    const finalPath = path.join(assetDir, meta.name)
                    await fs.promises.writeFile(finalPath, Buffer.from(data));
                })
            }
        }
    }
}

export default downloadKintoneAssets;