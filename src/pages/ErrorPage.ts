import { expect, Locator, Page } from "@playwright/test";

export class ErrorPage {
  private page: Page;
  errorHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    // Target the text or heading specific to eBay's error page
    this.errorHeading = page.getByText("Something went wrong on our end");
  }

  /**
   * Checks if the error page is present and handles it by navigating back.
   * This method waits for a short duration to see if the error page appears.
   * If it does, it navigates back to the previous page to recover.
   * If not, it simply returns false, indicating no error was present.
   * @param timeout The maximum time to wait for the error page to appear (default is 3000ms).
   * @returns A promise that resolves to true if the error page was handled, or false if it was not present.
   */
  async handleIfPresent(timeout = 3000): Promise<boolean> {
    try {
      // Wait briefly to see if the error page appeared
      await this.errorHeading.waitFor({ state: "visible", timeout });

      // Since there is no button, navigate back to recover
      await this.page.goBack();

      return true;
    } catch {
      // Error button didn't appear; safe to continue
      return false;
    }
  }
}
