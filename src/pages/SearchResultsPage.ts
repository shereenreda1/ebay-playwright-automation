import { expect, Page } from "@playwright/test";

/**
 * This class represents the Search Results Page of the eBay website and provides methods to interact with it.
 */
export class SearchResultsPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Validates that the search results page is displayed by checking the URL for the search query parameter.
   * It retrieves the current URL, parses it, and checks for the presence of the "_nkw" parameter, which indicates a search query.
   * If the parameter is not found, an assertion error will be thrown.
   * @note This method ensures that the user is on the search results page after performing a search.
   */
  async validateSearchResultsPage() {
    // Validate that the URL contains the search query
    const currentUrl = await this.page.url();
    const url = new URL(currentUrl);
    const searchQuery = url.searchParams.get("_nkw");
    await expect(searchQuery).not.toBeNull();
  }

  /**
   * Prints the count of search results displayed on the search results page.
   * It retrieves the text content of the element that displays the count of search results and logs it to the console.
   * The count is usually displayed in an element with class 'srp-controls__count-heading'.
   */
  async printSearchResultsCount() {
    // Get the count of search results and print it
    // The count is usually displayed in an element with class 'srp-controls__count-heading'
    const resultsCountText = await this.page
      .locator(".srp-controls__count-heading")
      .textContent();
    console.log(`Search Results Count: ${resultsCountText}`);
  }

  /**
   * Filters the search results by the specified transmission type.
   * @param transmission The transmission type to filter by.
   */
  async filterSearchResultsByTransmission(transmission: string) {
    // 1. Target the <details> section containing "Transmission"
    const transmissionSection = await this.page
      .locator("details")
      .filter({ hasText: "Transmission" });

    await transmissionSection.scrollIntoViewIfNeeded();

    // 2. Click the visible label container for the specified transmission type (e.g., "Manual")
    await transmissionSection
      .locator(".su-selection-group__label--container")
      .filter({ hasText: new RegExp(`^${transmission}`, "i") })
      .click();
  }

  /**
   * Validates that the transmission filter has been applied correctly by checking the URL for the specified transmission type.
   * @param transmission
   */
  async validateTransmissionFilterApplied(transmission: string) {
    await this.page.waitForURL(
      new RegExp(`Transmission=${transmission}`, "i"),
      {
        timeout: 10000,
      },
    );

    const currentUrl = await this.page.url();
    const parsedUrl = new URL(currentUrl);
    const transmissionParam = parsedUrl.searchParams.get("Transmission");

    await expect(transmissionParam).toBe(transmission);
  }
}
