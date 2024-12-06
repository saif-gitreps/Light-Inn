import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test("should allow the user to sign in", async ({ page }) => {
   await page.goto(UI_URL);
   await page.getByRole("link", { name: "Sign in" }).click();

   await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

   await page.locator("[name=email]").fill("test@test.com");
   await page.locator("[name=password]").fill("password123");
   await page.getByRole("button", { name: "Submit" }).click();

   await expect(page.getByText("Welcome back!")).toBeVisible();
   await expect(page.getByRole("link", { name: "Booked rooms" })).toBeVisible();
   await expect(page.getByRole("link", { name: "Hotels" })).toBeVisible();
   await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});

test("should allow the user to sign up", async ({ page }) => {
   const testEmail = `test${Date.now()}@register.com`;
   await page.goto(UI_URL);
   await page.getByRole("link", { name: "Sign up" }).click();

   await expect(
      page.getByRole("heading", { name: "Create a new account" })
   ).toBeVisible();

   await page.locator("[name=firstName]").fill("test_firstName");
   await page.locator("[name=lastName]").fill("test_lastName");
   await page.locator("[name=email]").fill(testEmail);
   await page.locator("[name=password]").fill("password123");
   await page.locator("[name=confirmPassword]").fill("password123");

   await page.getByRole("button", { name: "Submit" }).click();

   await expect(page.getByText("Account created successfully!")).toBeVisible();
   await expect(page.getByRole("link", { name: "Booked rooms" })).toBeVisible();
   await expect(page.getByRole("link", { name: "Hotels" })).toBeVisible();
   await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});
