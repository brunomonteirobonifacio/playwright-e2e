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

  // O site da UNESC responde 403 Forbidden para o user-agent padrão do
  // navegador headless. Usamos um user-agent realista para liberar o acesso.
  test.use({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
    extraHTTPHeaders: {
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
    }
  });

  test.beforeEach(async ({ page }) => {
    unescPage = new UnescPage(page);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  });

  test('deve pesquisar cursos e combinar a pesquisa com o filtro de modalidade', async () => {
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

    // A busca por texto reinicia o filtro de modalidade, então o
    // reaplicamos para combinar novamente a pesquisa com a modalidade.
    await unescPage.filterCoursesByType('Bacharelado');

    await expect(
      unescPage.unescElements.getCourseByName('Ciência da Computação')
    ).toBeVisible();
    await expect(
      unescPage.unescElements.getCourseByName('Medicina')
    ).toBeVisible();
    await expect(
      unescPage.unescElements.getCourseByName('Artes Visuais - Licenciatura')
    ).toBeHidden();
  });

  test('deve exibir a listagem de notícias', async () => {
    await unescPage.openAllNews();
    await unescPage.verifyNewsAreListed();
  });

  test('deve acessar o conteúdo de uma notícia', async () => {
    await unescPage.openAllNews();
    await unescPage.openFirstNews();
  });

  test('deve navegar para a agenda de eventos', async () => {
    // O link "Veja todos os eventos" abre a central de eventos em nova aba.
    const eventsPage = await unescPage.openAllEvents();
    await expect(eventsPage.getByRole('heading').first()).toBeVisible();
  });
});
