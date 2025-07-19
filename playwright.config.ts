import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "tests",
    use: {
        baseURL: "http://localhost:5173",
        browserName: "chromium",
        headless: true,
        trace: "on", // Record trace for all tests
    },
    reporter: "html", // Generate an HTML report

    webServer: {
        command: "npm run dev",
        port: 5173,
        timeout: 120 * 1000,
    },
});
