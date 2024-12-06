import { test, expect } from "@playwright/test";
import path from "path";

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

test("should allow the user to add a hotel", async ({ page }) => {
   await page.goto(`${UI_URL}/add-hotel`);
   await page.locator('[name="name"]').fill("Test Hotel");
   await page.locator('[name="city"]').fill("Test City");
   await page.locator('[name="country"]').fill("Test Country");
   await page.locator('[name="description"]').fill("Test Description");
   await page.locator('[name="pricePerNight"]').fill("100");

   await page.selectOption('select[name="rating"]', "3");
   await page.getByText("Budget").click();
   await page.getByLabel("Free Wifi").check();

   await page.locator('[name="adultCount"]').fill("2");
   await page.locator('[name="childCount"]').fill("1");

   await page.setInputFiles('[name="imageFiles"]', [
      path.join(__dirname, "files", "1.png"),
   ]);

   await page.getByRole("button", { name: "Save" }).click();

   await expect(page.getByText("Hotel saved successfully!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
   await page.goto(`${UI_URL}/my-hotels`);

   await expect(page.getByText("Dublin Getaways")).toBeVisible();
   await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
   await expect(page.getByText("Dublin, Ireland")).toBeVisible();
   await expect(page.getByText("All Inclusive")).toBeVisible();
   await expect(page.getByText("119 per night")).toBeVisible();
   await expect(page.getByText("2 adults, 3 children")).toBeVisible();
   await expect(page.getByText("2 Stars")).toBeVisible();

   await expect(page.getByRole("link", { name: "View" }).first()).toBeVisible();
   await expect(page.getByRole("link", { name: "New" })).toBeVisible();
});
