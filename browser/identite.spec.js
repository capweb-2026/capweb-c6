import { test, expect } from '@playwright/test';
/* global localStorage -- callbacks exécutés dans la page */

// Identité Homere.AI — critères SPEC 1 à 5, versant navigateur.
// Ces tests échouent tant que la page affiche encore « Cap Web »
// sans #accueil ni #suggestions.

const NOM = 'Homere.AI';
const EMOJI = '📖';
const ACCUEIL = 'Bienvenue sur Homere.AI ! De quelle mythologie voulez-vous parler ?';
const SUGGESTIONS = [
  'Quel est le conte le plus connu de la mythologie égyptienne ?',
  'Comment Ulysse est-il rentré chez lui ?',
  'Quels sont les évènements anonciateurs du Ragnarok ?',
];

function surveiller(page) {
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  return erreurs;
}

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

const lignes = (page) => page.locator('#messages li');

test.describe('Identité — critères 1 et 2 (nom et emoji)', () => {
  test('C1 — le titre principal affiche "Homere.AI", aussi dans <title>', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    await expect(page.locator('h1')).toContainText(NOM);
    const titre = await page.title();
    expect(titre).toContain(NOM);
    expect(titre).not.toContain('Cap Web');
    expect(erreurs).toHaveLength(0);
  });

  test('C2 — un seul emoji 📖 à côté du nom dans le h1', async ({ page }) => {
    await pageNeuve(page);
    const titrePrincipal = page.locator('h1');
    await expect(titrePrincipal).toContainText(EMOJI);
    const texte = (await titrePrincipal.textContent()) ?? '';
    expect(Array.from(texte).filter((caractere) => caractere === EMOJI)).toHaveLength(1);
  });
});

test.describe('Identité — critère 3 (accueil)', () => {
  test('C3a — conversation vide : accueil exact, hors de #messages', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('#accueil')).toHaveText(ACCUEIL);
    await expect(page.locator('#messages #accueil')).toHaveCount(0);
    await expect(lignes(page)).toHaveCount(0);
  });

  test('C3b — l’accueil disparaît dès le premier message envoyé', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(page.locator('#accueil')).toHaveCount(1);
    await expect(page.locator('#accueil')).toBeHidden();
  });

  test('C3c — l’accueil revient quand la conversation est effacée', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    page.once('dialog', (d) => d.accept());
    await page.locator('#effacer').click();
    await expect(lignes(page)).toHaveCount(0);
    await expect(page.locator('#accueil')).toBeVisible();
    await expect(page.locator('#accueil')).toHaveText(ACCUEIL);
  });
});

test.describe('Identité — critère 4 (suggestions)', () => {
  test('C4a — exactement trois questions suggérées, hors de #messages', async ({ page }) => {
    await pageNeuve(page);
    const boutons = page.locator('#suggestions button');
    await expect(boutons).toHaveCount(3);
    await expect(page.locator('#messages #suggestions')).toHaveCount(0);
    for (let i = 0; i < SUGGESTIONS.length; i += 1) {
      await expect(boutons.nth(i)).toHaveText(SUGGESTIONS[i]);
    }
  });

  test('C4b — cliquer remplit le champ sans envoyer', async ({ page }) => {
    await pageNeuve(page);
    const boutons = page.locator('#suggestions button');
    for (let i = 0; i < SUGGESTIONS.length; i += 1) {
      await page.locator('#message').fill('');
      await boutons.nth(i).click();
      await expect(page.locator('#message')).toHaveValue(SUGGESTIONS[i]);
      await expect(lignes(page)).toHaveCount(0);
    }
  });
});

test.describe('Identité — critère 5 (réponses signées)', () => {
  test('C5 — la ligne de l’assistant commence par "Homere.AI", pas « Cap Web »', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    const texte = ((await lignes(page).nth(1).textContent()) ?? '').trim();
    expect(texte.startsWith(NOM)).toBe(true);
    expect(texte).not.toContain('Cap Web');
    expect(erreurs).toHaveLength(0);
  });
});
