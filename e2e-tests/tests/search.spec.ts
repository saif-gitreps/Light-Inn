import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
   await page.goto(UI_URL);
   await page.getByRole("link", { name: "Sign in" }).click();

   await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

   await page.locator("[name=email]").fill("test@test.com");
   await page.locator("[name=password]").fill("password123");

   await page.getByRole("button", { name: "Submit" }).click();

   await expect(page.getByText("Welcome back!")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
   await page.goto(UI_URL);

   await page.getByPlaceholder("Your destination?").fill("Dublin");
   await page.getByRole("button", { name: "Search" }).click();

   await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
   await expect(page.getByText("Dublin Getaways")).toBeVisible();
});

test("should show hotel detail", async ({ page }) => {
   await page.goto(UI_URL);

   await page.getByPlaceholder("Your destination?").fill("Dublin");
   await page.getByRole("button", { name: "Search" }).click();

   await page.getByText("Dublin Getaways").click();
   await expect(page).toHaveURL(/detail/);
   await expect(page.getByRole("button", { name: "Book for" })).toBeVisible();
});

test("should book hotel", async ({ page }) => {
   await page.goto(UI_URL);

   await page.getByPlaceholder("Your destination?").fill("Dublin");

   const date = new Date();
   date.setDate(date.getDate() + 3);
   const formattedDate = date.toISOString().split("T")[0];
   await page.getByPlaceholder("Check-out Date").fill(formattedDate);

   await page.getByRole("button", { name: "Search" }).click();

   await page.getByText("Dublin Getaways").click();
   await page.getByRole("button", { name: "Book for" }).click();

   await expect(page.getByText("Total cost")).toBeVisible();

   const stripeFrame = page.frameLocator("iframe").first();
   await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242");
   await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
   await stripeFrame.locator('[placeholder="CVC"]').fill("242");
   await stripeFrame.locator('[placeholder="ZIP"]').fill("24225");

   await page.getByRole("button", { name: "Confirm booking" }).click();
   await expect(page.getByText("Hotel booked successfully!")).toBeVisible();

   await page.getByRole("link", { name: "Booked rooms" }).click();
   await expect(page.getByText("Dublin Getaways")).toBeVisible();
});
