import { test, expect } from '@playwright/test';

/**
 * Basic Tauri application E2E test
 * This test verifies that the Tauri app launches and basic functionality works
 */
test.describe('Tauri Application', () => {
  test('should launch and display main window', async ({ page }) => {
    // Navigate to the Tauri app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify the page title
    await expect(page).toHaveTitle(/Tauri/);
    
    // Verify basic UI elements are present
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have basic React functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Look for React root element
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });
});