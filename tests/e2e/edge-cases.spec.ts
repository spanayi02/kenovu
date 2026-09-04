import { test, expect } from "@playwright/test";

test.describe("Kenovu edge cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/discover");
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Reset demo data" }).click();
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Reset demo data" }).click();
    await page.waitForURL("**/discover");
  });

  test("a booked slot cannot be booked again", async ({ page }) => {
    const firstCard = page.locator('a[href^="/discover/slot-"]').first();
    await firstCard.click();

    const bookButton = page.getByRole("button", { name: /^Book for €/ });
    await bookButton.click();
    await page.getByRole("button", { name: /^Confirm booking/ }).click();
    await expect(page.getByText("You're booked!")).toBeVisible({ timeout: 5000 });

    // Go back twice to land on the slot details page again.
    await page.goBack();
    await page.goBack();

    await expect(
      page.getByRole("button", { name: /booked by someone else|no longer available|unavailable|already started/i }),
    ).toBeVisible();
  });

  test("business cannot publish a slot with Kenovu price above normal price", async ({ page }) => {
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Business demo" }).click();
    await page.getByTestId("create-slot-cta").click();
    await page.getByText("Deep Tissue Massage").first().click();
    await page.getByRole("button", { name: "Continue" }).click();

    const priceInput = page.locator('input[type="number"]');
    await priceInput.fill("999");
    await expect(page.getByText(/can't be higher than the normal price/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Preview" })).toBeDisabled();
  });

  test("corrupted localStorage falls back to a fresh seeded state instead of crashing", async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(window.localStorage)) {
        if (key.startsWith("kenovu:demo:")) {
          window.localStorage.setItem(key, "{not valid json");
        }
      }
    });
    await page.reload();
    await expect(page.getByRole("heading", { name: "Discover" })).toBeVisible();
    await expect(page.locator('a[href^="/discover/slot-"]').first()).toBeVisible();
  });

  test("mobile bottom navigation switches between customer screens", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Discover" })).toBeVisible();
    await nav.getByRole("link", { name: "Saved", exact: true }).click();
    await expect(page).toHaveURL(/\/saved$/);
    await nav.getByRole("link", { name: "Bookings", exact: true }).click();
    await expect(page).toHaveURL(/\/bookings$/);
    await nav.getByRole("link", { name: "Profile", exact: true }).click();
    await expect(page).toHaveURL(/\/profile$/);
  });

  test("clearing filters restores results from an empty state", async ({ page }) => {
    await page.getByPlaceholder(/Search massage/i).fill("zzz-no-such-service");
    await expect(page.getByText("No Kenovu Slots match your filters right now.")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator('a[href^="/discover/slot-"]').first()).toBeVisible();
  });
});
