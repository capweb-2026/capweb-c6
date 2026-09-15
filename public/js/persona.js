// Homere.AI — identité (SPEC 1 à 5). Données pures : aucun accès à la page.

export const persona = {
  nom: 'Homere.AI',
  emoji: '📖',
  accueil: 'Bienvenue sur Homere.AI ! De quelle mythologie voulez-vous parler ?',
  suggestions: [
    'Quel est le conte le plus connu de la mythologie égyptienne ?',
    'Comment Ulysse est-il rentré chez lui ?',
    'Quels sont les évènements anonciateurs du Ragnarok ?',
  ],
};

function estEmojiUnique(texte) {
  if (typeof texte !== 'string' || texte.length === 0) {
    return false;
  }
  let graphemes;
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    graphemes = [...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(texte)].map(
      (segment) => segment.segment,
    );
  } else {
    graphemes = Array.from(texte);
  }
  if (graphemes.length !== 1) {
    return false;
  }
  return /\p{Extended_Pictographic}/u.test(graphemes[0]);
}

export function validatePersona(candidat) {
  if (!candidat || typeof candidat !== 'object') {
    return { ok: false, erreurs: ['Le persona doit être un objet.'] };
  }
  const erreurs = [];
  const { nom, emoji, accueil, suggestions } = candidat;
  if (typeof nom !== 'string' || nom.length < 2 || nom.length > 20) {
    erreurs.push('Le nom doit contenir entre 2 et 20 caractères.');
  }
  if (!estEmojiUnique(emoji)) {
    erreurs.push('L’emoji doit être exactement un emoji.');
  }
  if (typeof accueil !== 'string' || typeof nom !== 'string' || !accueil.includes(nom)) {
    erreurs.push('L’accueil doit contenir le nom.');
  }
  if (!Array.isArray(suggestions) || suggestions.length !== 3) {
    erreurs.push('Le persona doit proposer exactement trois suggestions.');
  } else {
    const vide = suggestions.some(
      (suggestion) => typeof suggestion !== 'string' || suggestion.trim() === '',
    );
    if (vide) {
      erreurs.push('Aucune suggestion ne doit être vide.');
    }
  }
  if (erreurs.length > 0) {
    return { ok: false, erreurs };
  }
  return { ok: true };
}
