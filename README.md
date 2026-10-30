# eBay Automation Assessment with Playwright & TypeScript

This repository contains an automated end-to-end (E2E) testing suite for eBay, built using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

The test framework validates core e-commerce capabilities, including product searching, dynamic location setting, filtering, error page recovery, and URL parameter verification.

---

## 🛠️ Tech Stack & Key Framework Components

- **Test Framework:** [Playwright](https://playwright.dev/) (Node.js)
- **Language:** TypeScript
- **Design Pattern:** Page Object Model (POM)
- **Data Management:** Externalized JSON configuration (`data.json`)
- **Assertions:** Playwright built-in `expect` and native JavaScript `URL` parsing APIs

---

## 🏗️ Project Architecture

```text
├── src/
│   ├── data/
│   │   └── data.json              # Externalized test inputs (e.g., search terms, transmission type)
│   ├── pages/
│   │   ├── ErrorPage.ts           # Recovery logic for unexpected error gateways
│   │   ├── HomePage.ts            # Navigation, header assertions, and region setup
│   │   └── SearchResultsPage.ts   # Result counting, filter interaction, and URL state checks
│   └── tests/
│       └── search-and-filter.spec.ts  # Main E2E test scenarios
│__playwright-report/
│       └── [index.html](https://shereenreda1.github.io/ebay-playwright-automation/playwright-report/index.html)
├── playwright.config.ts           # Playwright runner configuration
├── package.json
└── README.md
```

---

## 🔑 Key Engineering & Reliability Solutions

### 1. Robust Location Handling (IFrame Context)

eBay’s search filters (such as Transmission) depend on the shipping location context. The framework switches the location context to the **United States** by accessing eBay's shipping iframe (`iframe[title="Shipping Address"]`) directly to ensure filter visibility across environments.

### 2. Smart Filter Selection & Hidden DOM Handling

eBay wraps native `<input type="checkbox">` elements in modern web components where the input itself is marked `hidden=""`. Instead of forcing clicks on invisible inputs, the framework targets the visible container (`.su-selection-group__label--container`) filtered by text, mimicking authentic user behavior without failing Playwright's actionability checks.

### 3. Asynchronous URL State Synchronization

To prevent race conditions where assertions execute before the browser finishes updating query parameters after a filter click, the suite uses `page.waitForURL()` with RegExp polling before running structural query parameter checks.

### 4. Resilient Navigation & Error Gateway Recovery

To handle transient anti-bot pages or generic network error screens during execution, the test suite integrates conditional `ErrorPage` checks before critical flow milestones to gracefully recover without crashing test execution.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ebay-playwright-automation.git
   cd ebay-playwright-automation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browser binaries:
   ```bash
   npx playwright install
   ```

---

## 🧪 Running Tests

### Run all tests in headless mode

```bash
npx playwright test
```

### Run tests in headed mode (UI visible)

```bash
npx playwright test --headed
```

### Run tests on a specific browser (e.g., Chromium)

```bash
npx playwright test --project=chromium
```

### Open Playwright HTML Report

```bash
npx playwright show-report
```

---

## 📋 Test Scenario Summary

**Test Name:** `Search for a specific car then filter by transmission type`

1. **Navigate to Home Page:** Opens eBay and validates key layout components (`#gh-logo`, `#gh-ac`, `#gh-search-btn`).
2. **Handle Intermittent Gateways:** Checks and recovers from error screens if present.
3. **Set Region:** Changes shipping destination to United States via IFrame interaction.
4. **Execute Search:** Queries for the car specified in `data.json` (e.g., `Mazda MX-5`).
5. **Verify & Log Results:** Asserts URL valid search parameter (`_nkw`) and logs result totals.
6. **Apply Filters:** Scrolls to and applies the specified Transmission filter (e.g., `Manual`).
7. **Verify Filter Application:** Polls URL and asserts parameter `Transmission=Manual`.
