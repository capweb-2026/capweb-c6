// Homere.AI — câblage (TP07 à TP10) : lire le formulaire, mettre à jour l'historique, demander l'affichage.
import { validateMessage, replyTo } from './brain.js';
import { renderMessages } from './view.js';
import { persona } from './persona.js';

const formulaire = document.querySelector('#chat-form');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
const statut = document.querySelector('#status');
const effacer = document.querySelector('#effacer');
const versionElt = document.querySelector('#version');
const accueil = document.querySelector('#accueil');
const suggestions = document.querySelector('#suggestions');

const CLE = 'capweb.historique';
const historique = [];

function afficher() {
  renderMessages(historique, liste);
  // L’accueil n’est visible que quand la conversation est vide.
  if (accueil) {
    accueil.textContent = persona.accueil;
    accueil.hidden = historique.length > 0;
  }
}

function sauvegarder() {
  localStorage.setItem(CLE, JSON.stringify(historique));
}

function charger() {
  const brut = localStorage.getItem(CLE);
  if (brut === null) {
    return;
  }
  try {
    const donnees = JSON.parse(brut);
    if (Array.isArray(donnees)) {
      historique.push(...donnees);
    }
  } catch {
    statut.textContent = 'Conversation précédente illisible : nouvelle conversation.';
  }
}

formulaire.addEventListener('submit', (event) => {
  event.preventDefault();
  const controle = validateMessage(champ.value);
  if (!controle.ok) {
    statut.textContent = controle.error;
    champ.focus();
    return;
  }
  historique.push({ role: 'user', text: controle.value });
  historique.push({ role: 'assistant', text: replyTo(controle.value) });
  sauvegarder();
  afficher();
  champ.value = '';
  statut.textContent = '';
  champ.focus();
});

effacer.addEventListener('click', () => {
  if (!confirm('Effacer toute la conversation ?')) {
    return;
  }
  historique.length = 0;
  localStorage.removeItem(CLE);
  afficher();
  statut.textContent = 'Conversation effacée.';
});

if (suggestions) {
  // Un clic place la suggestion dans le champ, sans l'envoyer.
  const boutons = suggestions.querySelectorAll('button');
  boutons.forEach((bouton, index) => {
    const texte = persona.suggestions[index] ?? bouton.textContent ?? '';
    bouton.textContent = texte;
    bouton.addEventListener('click', () => {
      champ.value = texte;
      champ.focus();
    });
  });
}

charger();
afficher();

fetch('/version.json', { headers: { accept: 'application/json' } })
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((donnees) => {
    if (donnees && typeof donnees.version === 'string' && versionElt) {
      versionElt.textContent = `version ${donnees.version}`;
    }
  })
  .catch(() => {});
