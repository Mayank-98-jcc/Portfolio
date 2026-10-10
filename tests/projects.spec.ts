import { test, expect } from '@playwright/test';

const deployedProjects = [
  {
    id: 'resumeiq',
    title: 'ResumeIQ',
    url: 'https://ai-resume-analyzer-job-matcher-mu.vercel.app/',
  },
  {
    id: 'oceanxplore',
    title: 'OceanXplore',
    url: 'https://3d-ocean-virid.vercel.app/?variable=temperature&depth=0',
  },
];

test('completed projects show real screenshots and open the exact demos safely', async ({
  page,
  context,
}) => {
  for (const project of deployedProjects) {
    // Keep this regression deterministic; deployment availability is verified separately.
    await context.route(project.url, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>Demo destination</title>' }),
    );
  }
  await page.goto('/');
  for (const project of deployedProjects) {
    const card = page.locator(`[data-project="${project.id}"]`);
    const screenshot = card.locator('.project-artwork img');
    await screenshot.scrollIntoViewIfNeeded();
    await expect(screenshot).toHaveAttribute('src', `/images/projects/${project.id}/preview.png`);
    await expect
      .poll(() => screenshot.evaluate((img) => (img as HTMLImageElement).naturalWidth))
      .toBe(1536);
    await expect(card.locator('.project-status')).toBeVisible();
    await expect(card.getByText(/CONCEPT VISUAL/)).toHaveCount(0);
    const link = card.getByRole('link', { name: `Live Demo: ${project.title}`, exact: true });
    await expect(link).toHaveAttribute('href', project.url);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const opened = page.waitForEvent('popup');
    await link.click();
    const popup = await opened;
    await popup.waitForLoadState('domcontentloaded');
    expect(popup.url()).toBe(project.url);
    expect(await popup.evaluate(() => window.opener === null)).toBeTruthy();
    await popup.close();
    await card.getByRole('button', { name: `View ${project.title} project details` }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.locator('.project-artwork img')).toHaveAttribute(
      'src',
      `/images/projects/${project.id}/preview.png`,
    );
    await expect(
      modal.getByRole('link', { name: 'View Live Project', exact: true }),
    ).toHaveAttribute('href', project.url);
    await expect(modal.getByRole('link', { name: 'Open full screenshot' })).toHaveAttribute(
      'href',
      `/images/projects/${project.id}/preview.png`,
    );
    await expect(modal.getByText(/Captured from the deployed/)).toBeVisible();
    await page.keyboard.press('Escape');
  }
  const developing = page.locator('[data-project="codementor-ai"]');
  await expect(developing.getByText('In Progress', { exact: true })).toBeVisible();
  await expect(developing.getByRole('link', { name: /Live Demo/ })).toHaveCount(0);
  await developing.getByRole('button', { name: 'View CodeMentor AI project details' }).click();
  await expect(page.getByRole('dialog').getByText('Currently in development')).toBeVisible();
  await expect(
    page.getByRole('dialog').getByRole('link', { name: 'View Live Project' }),
  ).toHaveCount(0);
});

test('missing screenshots fall back to project artwork without broken images', async ({ page }) => {
  await page.route('**/images/projects/resumeiq/preview.png', (route) => route.abort());
  await page.goto('/');
  const card = page.locator('[data-project="resumeiq"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator('.project-artwork img')).toHaveAttribute(
    'src',
    '/images/projects/resumeiq/concept.svg',
  );
  await expect(card.getByText('PREVIEW UNAVAILABLE · CONCEPT VISUAL')).toBeVisible();
  await expect(card.getByRole('link', { name: 'Live Demo: ResumeIQ' })).toBeVisible();
});

test('a failed screenshot and fallback still leave the project usable', async ({ page }) => {
  await page.route('**/images/projects/oceanxplore/*', (route) => route.abort());
  await page.goto('/');
  const card = page.locator('[data-project="oceanxplore"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator('.artwork-fallback')).toBeVisible();
  await expect(card.locator('.project-artwork img')).toHaveCount(0);
  await expect(card.getByRole('link', { name: 'Live Demo: OceanXplore' })).toBeVisible();
});

test('CodeMentor can adopt a real screenshot without changing its development status', async ({
  page,
}) => {
  // Exercise a future content update only in this test's browser; production keeps its concept.
  await page.route('**/src/data/projects.ts*', async (route) => {
    const response = await route.fetch();
    const body = (await response.text())
      .replace(
        /image: ["']\/images\/projects\/codementor-ai\/concept.svg["']/,
        'image: "/images/projects/codementor-ai/preview-test.png"',
      )
      .replace(/imageKind: ["']concept["']/, 'imageKind: "screenshot"');
    await route.fulfill({ response, body });
  });
  await page.route('**/images/projects/codementor-ai/preview-test.png', (route) =>
    route.fulfill({
      path: 'public/images/projects/resumeiq/preview.png',
      contentType: 'image/png',
    }),
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const card = page.locator('[data-project="codementor-ai"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator('.preview-screenshot img')).toBeVisible();
  await expect(card.locator('.project-status')).toHaveText('In Progress');
  await expect(card.getByRole('link', { name: /Live Demo/ })).toHaveCount(0);
  await expect(card.locator('.project-description')).toContainText('under development');
  await card.getByRole('button', { name: 'View CodeMentor AI project details' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.locator('.preview-screenshot img')).toBeVisible();
  await expect(modal.locator('.preview-screenshot')).not.toHaveCSS('padding', '0px');
  await expect(modal.getByRole('link', { name: 'Open full screenshot' })).toHaveAttribute(
    'href',
    '/images/projects/codementor-ai/preview-test.png',
  );
  await expect(modal.getByRole('link', { name: 'View Live Project' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.route('**/images/projects/codementor-ai/preview-test.png', (route) => route.abort());
  await page.reload();
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator('.code-concept')).toBeVisible();
  await expect(card.locator('.project-status')).toHaveText('In Progress');
});
