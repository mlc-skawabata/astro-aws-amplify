// @ts-check
import { defineConfig } from 'astro/config';

import process from 'node:process'
import { loadEnv } from "vite";
import downloadKintoneAssets from './src/integrations/astro-kintone-assets';
import awsAmplify from 'astro-aws-amplify';

const { 
  KINTONE_API_BASE_URL,
  KINTONE_FILE_APP_ID,
  KINTONE_FILE_APP_API_TOKEN
} = loadEnv(process.env.MODE_ENV ?? '', process.cwd(), '')

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // output: 'server'
  integrations: [
    downloadKintoneAssets({
      baseUrl: KINTONE_API_BASE_URL,
      appId: KINTONE_FILE_APP_ID,
      apiToken: KINTONE_FILE_APP_API_TOKEN,
      assetDir: 'public/downloads',
    })
  ],
  adapter: awsAmplify(),
  //build: {
  //  format: 'directory',
  //},
  //trailingSlash: 'always',
  redirects: {
    '/old-page': '/new-page',
  },
});
