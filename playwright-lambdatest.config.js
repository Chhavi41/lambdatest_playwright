import { defineConfig } from '@playwright/test';

const LT_USERNAME = process.env.LT_USERNAME;
const LT_ACCESS_KEY = process.env.LT_ACCESS_KEY;

export default defineConfig({
  projects: [
    {
      name: 'chrome-lt',
      use: {
        browserName: 'chromium',
        connectOptions: {
          wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify({
              browserName: 'Chrome',
              browserVersion: 'latest',
              'LT:Options': {
                platform: 'Windows 10',
                build: 'Playwright Docker Demo',
                name: 'Playwright sample test',
                user: LT_USERNAME,
                accessKey: LT_ACCESS_KEY,
              },
            })
          )}`,
        },
      },
    },
  ],
});
