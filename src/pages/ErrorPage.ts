import { expect, Locator, Page } from "@playwright/test";

export class ErrorPage {
    private page: Page;
    errorButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.errorButton = page.locator(".fake-btn");
    }

    async handleErrorPage() {
        await expect(this.page.locator(".fake-btn")).toBeVisible();
        await this.page.locator(".fake-btn").click();
    }

}