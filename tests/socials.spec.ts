import { test, expect } from '@playwright/test';
import { createContactMailto } from '../src/lib/contact';

const personalLinks = {
  email: 'mailto:mayankthapliyal500@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mayank-thapliyal-439565386/',
  github: 'https://github.com/Mayank-98-jcc',
};

test('verified personal links retain exact URLs and safe external attributes', async ({ page }) => {
  await page.goto('/');
  for (const selector of ['#contact', 'footer']) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    for (const href of Object.values(personalLinks)) {
      const links = section.locator(`a[href="${href}"]`);
      await expect(links.first()).toBeVisible();
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  }
});

test('hero and navigation calls to action reach work and contact', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'SCROLL TO EXPLORE' }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.locator('.nav-cta').click();
  await expect(page).toHaveURL(/#contact$/);
  await page.getByText('Prefer to write a message here?').click();
  await expect(page.getByLabel('Your name')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open email draft' })).toBeVisible();
});

test('contact email draft preserves the recipient and safely encodes message content', async () => {
  const fields = {
    name: 'Alex & Sam',
    email: 'alex+portfolio@example.com',
    message: 'Hello Mayank!\nReact & AI? #collaboration — let’s connect.',
  };
  const mailto = new URL(createContactMailto(fields));
  expect(`${mailto.protocol}${mailto.pathname}`).toBe(personalLinks.email);
  expect(mailto.searchParams.get('subject')).toBe(`Portfolio inquiry from ${fields.name}`);
  expect(mailto.searchParams.get('body')).toBe(
    `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`,
  );
  expect([...mailto.searchParams.keys()]).toEqual(['subject', 'body']);
  expect(mailto.hash).toBe('');
});
