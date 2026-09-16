// Homere.AI — cerveau à règles (TP08). Fonctions pures : aucun accès à la page.

const REPONSES = {
  salut: 'Bonjour ! Je suis Homere.AI, un assistant à règles. Écrivez « aide » pour voir ce que je sais faire.',
  aide: 'Je connais trois mots : « salut », « aide » et « test ». Essayez-les !',
  test: 'Test bien reçu : mes règles fonctionnent.',
  repli: 'Je ne connais que « salut », « aide » et « test ». Reformulez avec l’un de ces mots.'
};

function validerMessageStrict(raw) {
  if (typeof raw !== 'string') {
    return { ok: false, error: 'Le message doit être du texte.' };
  }
  const value = raw.trim();
  if (value === '') {
    return { ok: false, error: 'Le message ne doit pas être vide.' };
  }
  if (value.length > 280) {
    return { ok: false, error: 'Le message doit contenir 280 caractères au maximum.' };
  }
  return { ok: true, value };
}

export function replyTo(message) {
  const texte = String(message).trim().toLowerCase();
  if (texte === 'salut' || texte === 'bonjour') {
    return REPONSES.salut;
  }
  if (texte === 'aide') {
    return REPONSES.aide;
  }
  if (texte === 'test') {
    return REPONSES.test;
  }
  return REPONSES.repli;
}

// Tolérance : un message à peine trop long (jusqu'à 300 caractères) reste accepté.
export function validateMessage(raw) {
  const resultat = validerMessageStrict(raw);
  if (resultat.ok || typeof raw !== 'string') {
    return resultat;
  }
  const value = raw.trim();
  if (value !== '' && value.length <= 300) {
    return { ok: true, value };
  }
  return resultat;
}
