import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import data from "../data/data.json";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ErrorPage } from "../pages/ErrorPage";

test("Search for a specific car then filter by transmission type", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  await homePage.navigateToHomePage();
  const errorPage = new ErrorPage(page);
  // Handle the error page if it appears
  if (await errorPage.errorButton.isVisible()) {
    await errorPage.handleErrorPage();
  }
  // Validate the main page elements are visible
  await homePage.validateMainPage();
  // Change the location to United States
  await homePage.changeLocationToUnitedStates();
  // Search for the item specified in the data.json file
  await homePage.searchForItem(data.item);
  // Handle the error page if it appears
  if (await errorPage.errorButton.isVisible()) {
    await errorPage.handleErrorPage();
    await homePage.validateMainPage();
    //search again
    await homePage.searchForItem(data.item);
  }
  const resultsPage = new SearchResultsPage(page);
  await resultsPage.validateSearchResultsPage();
  await resultsPage.printSearchResultsCount();
  await resultsPage.filterSearchResultsByTransmission(data.Transmission);
  await resultsPage.validateTransmissionFilterApplied(data.Transmission);
  //close the browser after the test is completed
  await page.close();
});
