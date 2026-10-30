import { Page, expect } from "@playwright/test";

/**
 * This class represents the Home Page of the eBay website and provides methods to interact with it.
 */
export class HomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the home page of the eBay website.
   * If the error page is displayed, it clicks on the "Go to homepage" link to navigate back to the homepage.
   * This method ensures that the user is on the home page before performing any further actions.
   */
  async navigateToHomePage() {
    await this.page.goto("/");
  }

  /**
   * Validates that the main elements of the home page are visible, including the logo and search bar.
   */
  async validateMainPage() {
    // Validate the logo and search bar are visible
    await expect(this.page.locator("#gh-logo")).toBeVisible();
    await expect(this.page.locator("#gh-ac")).toBeVisible();
    await expect(this.page.locator("#gh-search-btn")).toBeVisible();
  }

  /**
   * Changes the location to the United States on the eBay website.
   * It interacts with the location selection iframe and selects "United States" from the country dropdown.
   * After selecting the country, it clicks the submit button to apply the change.
   * This method ensures that the user is browsing eBay with the location set to the United States.
   * @note This is used because the layout of the website changes based on the location, and some elements are not visible like transmission filter if the location is not set to the United States.
   */
  async changeLocationToUnitedStates() {
    // 1. Click the button that triggers the shipping address modal/iframe
    await this.page
      .locator("button")
      .filter({ hasText: /Add address|Egypt/i })
      .first()
      .click();

    // 2. Define the frame locator
    const shippingFrame = this.page.frameLocator(
      'iframe[title="Shipping Address"]',
    );
    const countrySelect = shippingFrame.locator("#country");

    // 3. Explicitly wait for the element inside the iframe to be visible
    await countrySelect.waitFor({ state: "visible", timeout: 10000 });

    // 4. Perform selectOption
    await countrySelect.selectOption("US");

    // 5. Submit form
    const submitBtn = shippingFrame.locator(".submit-button");
    await submitBtn.waitFor({ state: "visible", timeout: 5000 });
    await submitBtn.click();
  }

  /**
   * Searches for an item on the eBay website.
   * @param item The item to search for.
   */
  async searchForItem(item: string) {
    await this.page.fill("#gh-ac", item);
    await this.page.click("#gh-search-btn");
  }
}
