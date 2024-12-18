// @ts-check
import { defineConfig } from 'astro/config';
import downloadKintoneAssets from './src/integrations/astro-kintone-assets';
import awsAmplify from 'astro-aws-amplify';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // output: 'server'
  integrations: [
    downloadKintoneAssets()
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
