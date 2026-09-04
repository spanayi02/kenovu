import { test, expect } from "@playwright/test";

test.describe("Kenovu critical loop", () => {
  test("business publishes a slot, customer books it, business sees the booking, state survives refresh", async ({
    page,
  }) => {
    await page.goto("/discover");

    // Reset demo data to a clean, known state (double-tap the reset control).
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Reset demo data" }).click();
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Reset demo data" }).click();
    await page.waitForURL("**/discover");

    // 1. Enter Business Mode
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Business demo" }).click();
    await expect(page).toHaveURL(/\/business$/);
    await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();

    // 2. Create a Kenovu Slot
    await page.getByTestId("create-slot-cta").click();
    await expect(page).toHaveURL(/\/business\/create/);

    await page.getByText("Deep Tissue Massage").first().click();

    // Time step — default time is fine, continue.
    await page.getByRole("button", { name: "Continue" }).click();

    // Price step — apply a -30% quick discount.
    await page.getByRole("button", { name: "-30%" }).click();
    await page.getByRole("button", { name: "Preview" }).click();

    // Preview step — publish.
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText("Your Kenovu Slot is live.")).toBeVisible();

    // 3. View as customer — jumps into Customer Mode on the new slot.
    const viewAsCustomer = page.getByRole("button", { name: "View as customer" });
    await viewAsCustomer.click();
    await expect(page).toHaveURL(/\/discover\/slot-/);

    // 4. Slot details show the service we just published.
    await expect(page.getByRole("heading", { name: "Deep Tissue Massage" })).toBeVisible();
    const bookButton = page.getByRole("button", { name: /^Book for €/ });
    await expect(bookButton).toBeVisible();

    // 5. Book it.
    await bookButton.click();
    await expect(page).toHaveURL(/\/confirm$/);
    await page.getByRole("button", { name: /^Confirm booking/ }).click();

    // 6. Success.
    await expect(page.getByText("You're booked!")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Booking reference/)).toBeVisible();

    // 7. Switch back to Business Mode and confirm the booking is visible.
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Customer demo" }).click();
    await page.getByTestId("demo-mode-switcher").getByRole("button", { name: "Business demo" }).click();
    await expect(page).toHaveURL(/\/business$/);

    await page.getByRole("link", { name: "Slots" }).click();
    await page.getByRole("button", { name: /^Booked/ }).click();
    await expect(page.getByText("Deep Tissue Massage")).toBeVisible();
    await expect(page.getByText(/Customer: Maria P\./)).toBeVisible();

    // 9. Refresh and verify the booking persisted.
    await page.reload();
    await page.getByRole("button", { name: /^Booked/ }).click();
    await expect(page.getByText(/Customer: Maria P\./)).toBeVisible();
  });
});
