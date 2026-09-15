import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { persona, validatePersona } from '../public/js/persona.js';

// Identité Homere.AI — critères SPEC 1 à 5, versant données.
// Ces tests échouent tant que public/js/persona.js n'exporte pas le persona attendu.

const ACCUEIL_ATTENDU = 'Bienvenue sur Homere.AI ! De quelle mythologie voulez-vous parler ?';
const SUGGESTIONS_ATTENDUES = [
  'Quel est le conte le plus connu de la mythologie égyptienne ?',
  'Comment Ulysse est-il rentré chez lui ?',
  'Quels sont les évènements anonciateurs du Ragnarok ?',
];

describe('Identité — critères 1 à 5 (persona)', () => {
  it('C1 — nom vaut "Homere.AI"', () => {
    assert.equal(persona.nom, 'Homere.AI');
  });

  it('C2 — emoji vaut "📖"', () => {
    assert.equal(persona.emoji, '📖');
  });

  it('C3 — accueil exact', () => {
    assert.equal(persona.accueil, ACCUEIL_ATTENDU);
  });

  it('C4 — trois suggestions exactes, dans l’ordre', () => {
    assert.deepEqual(persona.suggestions, SUGGESTIONS_ATTENDUES);
  });

  it('C5 — le nom signé est "Homere.AI", pas "Cap Web"', () => {
    assert.equal(persona.nom, 'Homere.AI');
    assert.notEqual(persona.nom, 'Cap Web');
  });
});

describe('Identité — validatePersona (règles SPEC)', () => {
  it('6 — accepte le persona de référence', () => {
    assert.deepEqual(validatePersona(persona), { ok: true });
  });

  it('7 — refuse un nom de moins de 2 ou de plus de 20 caractères', () => {
    // Base valide selon SPEC, indépendante de public/js/persona.js.
    const base = {
      nom: 'Homere.AI',
      emoji: '📖',
      accueil: ACCUEIL_ATTENDU,
      suggestions: [...SUGGESTIONS_ATTENDUES],
    };
    for (const nom of ['H', '', 'a'.repeat(21), 'a'.repeat(30)]) {
      // Accueil adapté pour contenir le nom : seul le nom doit provoquer le refus.
      const candidat = { ...base, nom, accueil: `Bienvenue ${nom} ! De quelle mythologie voulez-vous parler ?` };
      const resultat = validatePersona(candidat);
      assert.equal(resultat.ok, false);
      assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
    }
  });

  it('8 — refuse un emoji qui n’est pas exactement un emoji', () => {
    for (const emoji of ['', 'livre', '📖📖', 'ab']) {
      const resultat = validatePersona({ ...persona, emoji });
      assert.equal(resultat.ok, false);
      assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
    }
  });

  it('9 — refuse un accueil qui ne contient pas le nom', () => {
    const resultat = validatePersona({ ...persona, accueil: 'Bienvenue ! De quelle mythologie voulez-vous parler ?' });
    assert.equal(resultat.ok, false);
    assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
  });

  it('10 — refuse des suggestions différentes de trois ou une suggestion vide', () => {
    const cas = [
      ['une seule suggestion'],
      [...SUGGESTIONS_ATTENDUES, 'Une quatrième suggestion'],
      [SUGGESTIONS_ATTENDUES[0], '', SUGGESTIONS_ATTENDUES[2]],
      [SUGGESTIONS_ATTENDUES[0], '   ', SUGGESTIONS_ATTENDUES[2]],
    ];
    for (const suggestions of cas) {
      const resultat = validatePersona({ ...persona, suggestions });
      assert.equal(resultat.ok, false);
      assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
    }
  });
});
