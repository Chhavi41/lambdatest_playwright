import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://www.lambdatest.com/',
    browserName: 'chromium',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
