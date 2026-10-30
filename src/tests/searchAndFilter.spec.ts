import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import data from "../data/data.json";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ErrorPage } from "../pages/ErrorPage";

test("Search for a specific car then filter by transmission type", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const errorPage = new ErrorPage(page);
  // Navigate to home and handle optional initial error safely
  await homePage.navigateToHomePage();
  await errorPage.handleIfPresent();
  await homePage.navigateToHomePage();

  // Validate main page and perform actions
  await homePage.validateMainPage();
  // await homePage.changeLocationToUnitedStates();
  await homePage.searchForItem(data.item);

  // Handle optional error after search, re-searching if it appeared
  if (await errorPage.handleIfPresent()) {
    await homePage.navigateToHomePage();
    await homePage.validateMainPage();
    await homePage.searchForItem(data.item);
  }

  // Validate search results and apply filter
  const resultsPage = new SearchResultsPage(page);
  if (await errorPage.handleIfPresent()) {
    await homePage.navigateToHomePage();
    await homePage.validateMainPage();
    await homePage.searchForItem(data.item);
  }
  await resultsPage.validateSearchResultsPage();
  await resultsPage.printSearchResultsCount();
  await resultsPage.filterSearchResultsByTransmission(data.Transmission);
  await resultsPage.validateTransmissionFilterApplied(data.Transmission);

  await page.close();
});
