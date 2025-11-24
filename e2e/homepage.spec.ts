import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check that page title exists
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('displays navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for navigation elements (adjust selectors based on actual implementation)
    const nav = page.locator('nav, header')
    await expect(nav.first()).toBeVisible()
  })
})

test.describe('Trail Discovery', () => {
  test('navigates to trails page', async ({ page }) => {
    await page.goto('/')
    
    // Look for trails link and click it
    const trailsLink = page.getByRole('link', { name: /trails/i }).first()
    if (await trailsLink.isVisible()) {
      await trailsLink.click()
      await expect(page).toHaveURL(/.*trails.*/)
    }
  })
})

