import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  outputDir: './tests/artifacts',
  use: {
    baseURL: 'http://127.0.0.1:8081',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: [
    {
      command:
        'cmd /c set CI=1&&set HOME=%CD%\\.pw-home&&set USERPROFILE=%CD%\\.pw-home&&set EXPO_NO_DOCTOR=1&&set NODE_OPTIONS=--max-old-space-size=4096&&npx expo start --web --port 8081',
      url: 'http://127.0.0.1:8081',
      reuseExistingServer: true,
      timeout: 240000,
    },
    {
      command: 'cmd /c npm run server',
      url: 'http://127.0.0.1:3001/missions',
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
