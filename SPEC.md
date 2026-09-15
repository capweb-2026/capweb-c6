# SPEC.md — Homere.AI

## Objectif

L'assistant est un conteur de mythologies qui raconte et explique les mythes grecs, nordiques et égyptiens à la demande de l'utilisateur.

## Critères d'acceptation

Rédigez chaque critère sous la forme « Quand …, le système … ». Numérotez-les : les tests et les PR y feront référence.

1. **Nom** — Quand la page s'ouvre, le système affiche le nom de l'assistant dans le titre principal : "Homere.AI".
2. **Emoji** — Quand la page s'ouvre, le système affiche un seul emoji de livre à a côté du nom.
3. **Accueil** — Quand la conversation est vide, le système affiche le message d'acceuil : 'Bienvenue sur Homere.AI ! De quelle mythologie voulez-vous parler ?'. Ce message n'est pas une ligne de `#messages`, disparaît dès le premier message envoyé et revient quand la conversation est effacée.
4. **Suggestions** — Quand la page s'ouvre, le système propose exactement trois questions suggérées. Quand l'utilisateur clique sur l'une d'elles, le système la place dans le champ de saisie sans l'envoyer. Les 3 questions sont : 
   - Quel est le conte le plus connu de la mythologie égyptienne ?
   - Comment Ulysse est-il rentré chez lui ?
   - Quels sont les évènent anonciateurs du Ragnarok ?
5. **Réponses signées** — Quand l'assistant répond, sa ligne commence par son nom au lieu de « Cap Web ».
6. **Contrat** — Les tests de contrat CP1 restent verts.

## Hors périmètre

Pas de choix de l'identité par l'utilisateur, pas d'image d'avatar, pas d'appel à une IA.

## Données et fonctions attendues

- `public/js/persona.js` exporte `persona = { nom, emoji, accueil, suggestions }` et `validatePersona(persona)`, qui renvoie `{ ok: true }` ou `{ ok: false, erreurs: [texte, …] }`.
- `validatePersona` refuse : un nom de moins de 2 ou de plus de 20 caractères ; un emoji qui n'est pas exactement un emoji ; un accueil qui ne contient pas le nom ; un nombre de suggestions différent de trois ou une suggestion vide.
- La page contient `#accueil` et `#suggestions`, en dehors de `#messages`.
- `persona.js` est ajouté à la liste blanche du serveur local.

## Questions ouvertes

Aucune