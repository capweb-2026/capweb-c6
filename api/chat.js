// Homere.AI — fonction serverless de sante (etape 1).
// GET -> 200 {"pret": true}. Autre methode -> 405. Sans dependance, sans cle.
export default function handler(req, res) {
  const methode = req?.method?.toUpperCase() ?? 'GET';
  if (methode !== 'GET') {
    res.status(405).json({ erreur: 'Méthode non autorisée' });
    return;
  }
  res.status(200).json({ pret: true });
}
