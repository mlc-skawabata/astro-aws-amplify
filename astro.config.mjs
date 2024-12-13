// @ts-check
import { defineConfig } from 'astro/config';
import awsAmplify from 'astro-aws-amplify';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // output: 'server'
  adapter: awsAmplify(),
  redirects: {
    '/old-page': '/new-page',
  }
});
