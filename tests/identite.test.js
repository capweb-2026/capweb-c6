import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { persona } from '../public/js/persona.js';

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
