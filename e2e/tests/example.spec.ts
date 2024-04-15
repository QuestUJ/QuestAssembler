import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Auth0", () => {
  test("shoud react to sign in button", async ({ page }) => {
    const button = page.getByText("Log in");

    await button.click();

    await page.waitForLoadState('domcontentloaded')

    await page.getByLabel('Email address').fill('bro@xyz.com')

  });
});
