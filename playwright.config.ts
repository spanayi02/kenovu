import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const CANDIDATE_CHROMIUM = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/opt/pw-browsers/chromium/chrome-linux/chrome",
];

const DEFAULT_CHROMIUM = CANDIDATE_CHROMIUM.find((p) => existsSync(p));

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    launchOptions: {
      // The sandbox ships a Chromium build that playwright-core doesn't
      // expect, so point at it directly rather than downloading one.
      executablePath: process.env.PW_CHROMIUM_PATH ?? DEFAULT_CHROMIUM,
    },
  },
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
