import { test, expect } from "@playwright/test";

test.skip("local app title", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toBe("Vite + React + TS");

    const todos = page.getByRole("link", { name: "Todos" });

    await expect(todos).toBeVisible();

    await todos.click();

    await expect(page).toHaveURL(/todos/);
});
