import { expect, Page } from '@playwright/test';
import UnescElements from '../elements/UnescElements';
import BasePage from './BasePage';

/** Page object for the UNESC institutional website. */
export default class UnescPage extends BasePage {
  readonly unescElements: UnescElements;

  constructor(readonly page: Page) {
    super(page);
    this.unescElements = new UnescElements(page);
  }

  async openUndergraduateCourses(): Promise<void> {
    const coursesUrl = new URL(
      '/portal/graduacao',
      this.page.url()
    ).toString();
    await this.page.goto(coursesUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.unescElements.getCourseSearchField()).toBeVisible();
  }

  async filterCoursesByType(courseType: string): Promise<void> {
    await this.unescElements.getCourseTypeFilter(courseType).click();
  }

  async searchCourse(courseName: string): Promise<void> {
    await this.unescElements.getCourseSearchField().fill(courseName);
  }

  async clearCourseSearch(): Promise<void> {
    await this.unescElements.getCourseSearchField().clear();
  }

  async openAllNews(): Promise<void> {
    const link = this.unescElements.getAllNewsLink();
    await expect(link).toBeVisible();
    await link.click();
    await expect(this.page).not.toHaveURL('https://www.unesc.net/');
    await expect(this.unescElements.getPageHeadings().first()).toBeVisible();
  }

  async openAllEvents(): Promise<void> {
    const link = this.unescElements.getAllEventsLink();
    await expect(link).toBeVisible();
    await link.click();
    await expect(this.page).not.toHaveURL('https://www.unesc.net/');
    await expect(this.unescElements.getPageHeadings().first()).toBeVisible();
  }

  async verifyNewsAreListed(): Promise<void> {
    const newsCards = this.unescElements.getNewsCards();
    await expect(newsCards.first()).toBeVisible();
    await expect(newsCards).not.toHaveCount(0);
    await expect(this.unescElements.getFirstNewsCardTitle()).not.toBeEmpty();
  }

  async openFirstNews(): Promise<void> {
    const listingUrl = this.page.url();
    const firstNews = this.unescElements.getNewsCards().first();

    await expect(firstNews).toBeVisible();
    const newsTitle = (
      await this.unescElements.getFirstNewsCardTitle().innerText()
    ).trim();

    await firstNews.click();
    await expect(this.page).not.toHaveURL(listingUrl);
    await expect(
      this.page.getByRole('heading', { name: newsTitle, exact: true })
    ).toBeVisible();
  }
}
