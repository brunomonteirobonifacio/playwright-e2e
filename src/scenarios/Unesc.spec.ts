import { expect, test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import UnescPage from '../support/pages/UnescPage';

test.describe('UNESC - site institucional', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let unescPage: UnescPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.unesc')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    unescPage = new UnescPage(page);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  });

  test(
    'deve pesquisar cursos e combinar a pesquisa com o filtro de modalidade',
    async () => {
      await unescPage.openUndergraduateCourses();

      await unescPage.filterCoursesByType('Bacharelado');

      await expect(
        unescPage.unescElements.getCourseByName('Ciência da Computação')
      ).toBeVisible();
      await expect(
        unescPage.unescElements.getCourseByName('Artes Visuais - Licenciatura')
      ).toBeHidden();

      await unescPage.searchCourse('Ciência da Computação');

      await expect(
        unescPage.unescElements.getCourseByName('Ciência da Computação')
      ).toBeVisible();
      await expect(
        unescPage.unescElements.getCourseByName('Medicina')
      ).toBeHidden();

      await unescPage.clearCourseSearch();

      await expect(
        unescPage.unescElements.getCourseByName('Ciência da Computação')
      ).toBeVisible();
      await expect(
        unescPage.unescElements.getCourseByName('Medicina')
      ).toBeVisible();
      await expect(
        unescPage.unescElements.getCourseByName('Artes Visuais - Licenciatura')
      ).toBeHidden();
    }
  );

  test('deve exibir a listagem de notícias', async () => {
    await unescPage.openAllNews();
    await unescPage.verifyNewsAreListed();
  });

  test('deve acessar o conteúdo de uma notícia', async () => {
    await unescPage.openAllNews();
    await unescPage.openFirstNews();
  });

  test('deve navegar para a agenda de eventos', async () => {
    await unescPage.openAllEvents();
    await expect(
      unescPage.unescElements.getPageHeadings().first()
    ).toBeVisible();
  });
});
