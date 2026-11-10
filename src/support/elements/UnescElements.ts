import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

/** Locators for the public UNESC institutional website. */
export default class UnescElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
  }

  getCourseSearchField(): Locator {
    return this.page.locator('#input-search');
  }

  getCourseTypeFilter(courseType: string): Locator {
    return this.page.getByText(courseType, { exact: true }).first();
  }

  getCourseByName(courseName: string): Locator {
    return this.page.getByText(courseName, { exact: true }).first();
  }

  getAllNewsLink(): Locator {
    return this.page.getByRole('link', { name: /veja todas as notícias/i });
  }

  getAllEventsLink(): Locator {
    return this.page.getByRole('link', { name: /veja todos os eventos/i });
  }

  getNewsCards(): Locator {
    return this.page
      .locator('a[href*="noticia"], a[href*="noticias"]')
      .filter({ has: this.page.locator('h2, h3, h4') });
  }

  getFirstNewsCardTitle(): Locator {
    return this.getNewsCards().first().locator('h2, h3, h4');
  }

  getPageHeadings(): Locator {
    return this.page.getByRole('heading');
  }
}
