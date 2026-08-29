const fs = require('fs');
const path = require('path');

// Comprehensive dictionary for automatic French translation of HSK terms
const dictionaryFr = {
  // Common terms & adjectives
  'white': 'Blanc / Pur',
  'snowy': 'Neigeux',
  'pure': 'Pur / Clair',
  'hundred': 'Cent (100)',
  'numerous': 'Nombreux',
  'all kinds of': 'De toutes sortes',
  'newspaper': 'Journal / Presse',
  'newsprint': 'Papier journal',
  'belgium': 'Belgique / Belge',
  'belgian': 'Belge',
  'convenient': 'Pratique / Commode / Bon marché',
  'to leave': 'Partir / Quitter',
  'to part (from)': 'Se séparer de',
  'to sing a song': 'Chanter une chanson',
  'to sing': 'Chanter',
  'to go out': 'Sortir',
  'to come out': 'Sortir / Émerger',
  'to occur': 'Se produire / Survenir',
  'to arrive': 'Arriver / Parvenir',
  'to reach': 'Atteindre / Arriver à',
  'to': 'À / Vers / Jusqu’à',
  'until': 'Jusqu’à',
  'bar': 'Bar / Comptoir / Particule',
  'bar (loanword)': 'Bar / Café',
  'to puff': 'Souffler',
  'bang': 'Pan ! / Bruit sec',
  'assistance': 'Assistance / Aide',
  'aid': 'Aide / Secours',
  'to aid': 'Aider / Soutenir',
  'matter': 'Chose / Affaire / Question',
  'thing': 'Chose / Objet',
  'business': 'Affaires / Commerce',
  'item': 'Article / Élément',
  'affair': 'Affaire / Événement',
  'wrong': 'Faux / Erroné / Incorrect',
  'mistake': 'Erreur / Faute',
  'error': 'Erreur / Anomalie',
  'right': 'Vrai / Correct / Droite',
  'correct': 'Correct / Exact',
  'true': 'Vrai / Véritable',
  'left': 'Gauche',
  'high': 'Haut / Élevé / Supérieur',
  'low': 'Bas / Faible',
  'expensive': 'Cher / Coûteux',
  'cheap': 'Bon marché / Économique',
  'inexpensive': 'Abordable / Économique',
  'long': 'Long / Durable',
  'short': 'Court / Bref / Petit',
  'fast': 'Rapide / Vite',
  'quick': 'Rapide / Prompt',
  'slow': 'Lent',
  'hot': 'Chaud / Chaleureux',
  'cold': 'Froid / Frais',
  'warm': 'Chaud / Tiède / Chaleureux',
  'cool': 'Frais / Agréable',
  'cloudy': 'Nuageux / Couvert',
  'sunny': 'Ensoleillé / Dégagé',
  'rain': 'Pluie / Pleuvoir',
  'snow': 'Neige / Neiger',
  'wind': 'Vent',
  'weather': 'Météo / Temps qu’il fait',
  'station': 'Gare / Station / Arrêt',
  'stop': 'Arrêt / S’arrêter',
  'store': 'Magasin / Boutique',
  'shop': 'Boutique / Commerce',
  'supermarket': 'Supermarché',
  'market': 'Marché / Place commerciale',
  'hospital': 'Hôpital / Clinique',
  'school': 'École / Établissement',
  'university': 'Université / Faculté',
  'college': 'Institut / Collège',
  'company': 'Entreprise / Société / Firme',
  'factory': 'Usine / Manufacture',
  'office': 'Bureau / Lieu de travail',
  'room': 'Pièce / Chambre / Salle',
  'classroom': 'Salle de classe',
  'meeting room': 'Salle de réunion',
  'conference room': 'Salle de conférence',
  'hotel': 'Hôtel / Auberge',
  'restaurant': 'Restaurant / Salle à manger',
  'bank': 'Banque / Établissement financier',
  'post office': 'Bureau de poste',
  'airport': 'Aéroport',
  'park': 'Parc / Jardin public',
  'cinema': 'Cinéma / Salle de projection',
  'movie theater': 'Cinéma',
  'theater': 'Théâtre / Salle de spectacle',
  'museum': 'Musée',
  'library': 'Bibliothèque',
  'to eat': 'Manger',
  'to drink': 'Boire',
  'to sleep': 'Dormir / Se reposer',
  'to wake up': 'Se réveiller',
  'to get up': 'Se lever',
  'to speak': 'Parler / S’exprimer',
  'to talk': 'Discuter / Parler',
  'to say': 'Dire / Déclarer',
  'to tell': 'Raconter / Informer',
  'to ask': 'Demander / Poser une question',
  'to answer': 'Répondre / Réponse',
  'to reply': 'Répondre / Rétorquer',
  'to call': 'Appeler / Téléphoner',
  'to phone': 'Téléphoner',
  'to write': 'Écrire / Rédiger',
  'to read': 'Lire / Étudier',
  'to listen': 'Écouter',
  'to hear': 'Entendre',
  'to look': 'Regarder / Voir',
  'to see': 'Voir / Apercevoir',
  'to watch': 'Regarder / Observer',
  'to buy': 'Acheter / Se procurer',
  'to sell': 'Vendre / Commercialiser',
  'to pay': 'Payer / Régler',
  'to cost': 'Coûter',
  'to give': 'Donner / Offrir / Fournir',
  'to take': 'Prendre / Saisir',
  'to bring': 'Apporter / Amener',
  'to fetch': 'Aller chercher / Récupérer',
  'to send': 'Envoyer / Expédier',
  'to receive': 'Recevoir / Obtenir',
  'to accept': 'Accepter / Valider',
  'to refuse': 'Refuser / Rejeter',
  'to agree': 'Être d’accord / Convenir',
  'to disagree': 'Être en désaccord',
  'to meet': 'Rencontrer / Faire la connaissance',
  'to introduce': 'Présenter / Introduire',
  'to know': 'Connaître / Savoir',
  'to understand': 'Comprendre / Saisir',
  'to think': 'Penser / Réfléchir / Estimer',
  'to consider': 'Considérer / Envisager',
  'to believe': 'Croire / Penser',
  'to hope': 'Espérer / Souhaiter',
  'to wish': 'Souhaiter / Désirer',
  'to want': 'Vouloir / Désirer',
  'to need': 'Avoir besoin de / Nécessiter',
  'to must': 'Devoir / Falloir',
  'to should': 'Devoir / Devrait',
  'to can': 'Pouvoir / Être capable de',
  'to may': 'Pouvoir / Avoir la permission',
  'to like': 'Aimer / Apprécier',
  'to love': 'Aimer / Adorer',
  'to hate': 'Détester / Haïr',
  'to prefer': 'Préférer',
  'to start': 'Commencer / Débuter',
  'to begin': 'Commencer / Amorcer',
  'to finish': 'Terminer / Finir',
  'to end': 'Terminer / Conclure',
  'to stop': 'Arrêter / Cesser',
  'to continue': 'Continuer / Poursuivre',
  'to change': 'Changer / Modifier / Échanger',
  'to improve': 'Améliorer / Progresser',
  'to develop': 'Développer / Croître',
  'to increase': 'Augmenter / Accroître',
  'to decrease': 'Diminuer / Réduire',
  'to reduce': 'Réduire / Baisser',
  'to check': 'Vérifier / Contrôler',
  'to inspect': 'Inspecter / Examiner',
  'to test': 'Tester / Éprouver',
  'to prepare': 'Préparer / Organiser',
  'to plan': 'Planifier / Projeter',
  'to arrange': 'Arranger / Organiser',
  'to organize': 'Organiser / Structurer',
  'to manage': 'Gérer / Diriger / Administrer',
  'to operate': 'Exploiter / Opérer',
  'to produce': 'Produire / Fabriquer',
  'to manufacture': 'Fabriquer / Usiner',
  'to deliver': 'Livrer / Distribuer',
  'to transport': 'Transporter / Acheminer',
  'to ship': 'Expédier par bateau / Fret',
  'to export': 'Exporter',
  'to import': 'Importer',
  'to sign': 'Signer / Parapher',
  'to negotiate': 'Négocier / Pourparlers',
  'to cooperate': 'Coopérer / Collaborer',
  'to discuss': 'Discuter / Débattre',
  'to explain': 'Expliquer / Élucider',
  'to describe': 'Décrire / Dépeindre',
  'to suggest': 'Suggérer / Proposer',
  'to propose': 'Proposer / Soumettre',
  'to recommend': 'Recommander / Conseiller',
  'to advise': 'Conseiller / Guider',
  'to warn': 'Avertir / Prévenir',
  'to remind': 'Rappeler / Remémorer',
  'to remember': 'Se souvenir / Retenir',
  'to forget': 'Oublier / Omettre',
  'to lose': 'Perdre / Égarer',
  'to find': 'Trouver / Découvrir',
  'to discover': 'Découvrir',
  'to create': 'Créer / Fonder',
  'to build': 'Construire / Bâtir',
  'to design': 'Concevoir / Dessiner',
  'to protect': 'Protéger / Préserver',
  'to guarantee': 'Garantir / Assurer',
  'to promise': 'Promettre / S’engager',
  'to allow': 'Permettre / Autoriser',
  'to permit': 'Autoriser / Tolérer',
  'to forbid': 'Interdire / Proscrire',
  'to prevent': 'Empêcher / Prévenir',
  'to avoid': 'Éviter / Esquiver',
  'to solve': 'Résoudre / Régler',
  'to resolve': 'Résoudre / Dénouer',
  'to decide': 'Décider / Trancher',
  'to choose': 'Choisir / Sélectionner',
  'to select': 'Sélectionner / Trier',
  'to compare': 'Comparer / Confronter',
  'to measure': 'Mesurer / Évaluer',
  'to calculate': 'Calculer / Compter',
  'to count': 'Compter / Dénombrer',
  'to weigh': 'Peser / Mesurer le poids',
  'to pack': 'Emballer / Conditionner',
  'to package': 'Emballer / Coliser',
  'to load': 'Charger / Embarquer',
  'to unload': 'Décharger / Débarquer',
  'to clear customs': 'Dédouaner / Passer la douane',
  'to declare': 'Déclarer / Notifier',
  'to apply': 'Postuler / Appliquer',
  'to invest': 'Investir / Placer des capitaux',
  'to borrow': 'Emprunter',
  'to lend': 'Prêter / Avancer',
  'to rent': 'Louer / Prendre en location',
  'to hire': 'Embaucher / Recruter',
  'to dismiss': 'Licencier / Congédier',
  'to resign': 'Démissionner',
  'to retire': 'Prendre sa retraite',
  'to travel': 'Voyager / Se déplacer',
  'to visit': 'Visiter / Rendre visite',
  'to stay': 'Rester / Séjourner',
  'to live': 'Vivre / Habiter / Résider',
  'to reside': 'Résider / Demeurer',
  'to move': 'Déménager / Déplacer / Bouger',
  'to drive': 'Conduire / Piloter',
  'to ride': 'Monter (vélo, moto, cheval)',
  'to fly': 'Voler / Prendre l’avion',
  'to sail': 'Naviguer / Prendre la mer',
  'to swim': 'Nager',
  'to run': 'Courir',
  'to walk': 'Marcher / Se promener',
  'to sit': 'S’asseoir',
  'to stand': 'Se tenir debout / Rester',
  'to lie': 'Être couché / Mentir',
  'to wait': 'Attendre',
  'to serve': 'Servir / Assister',
  'to support': 'Soutenir / Appuyer',
  'to help': 'Aider / Porter assistance',
};

function translateWord(eng) {
  if (!eng) return '';
  let clean = eng.trim().replace(/^to\s+/, '').toLowerCase();
  
  // Direct match
  if (dictionaryFr[eng.trim().toLowerCase()]) return dictionaryFr[eng.trim().toLowerCase()];
  if (dictionaryFr[clean]) return dictionaryFr[clean];
  if (dictionaryFr['to ' + clean]) return dictionaryFr['to ' + clean];

  // Common phrase replacements
  let res = eng
    .replace(/\b(to\s+)?love\b/gi, 'aimer')
    .replace(/\b(to\s+)?like\b/gi, 'apprécier')
    .replace(/\b(to\s+)?see\b/gi, 'voir')
    .replace(/\b(to\s+)?look\b/gi, 'regarder')
    .replace(/\b(to\s+)?eat\b/gi, 'manger')
    .replace(/\b(to\s+)?drink\b/gi, 'boire')
    .replace(/\b(to\s+)?speak\b/gi, 'parler')
    .replace(/\b(to\s+)?read\b/gi, 'lire')
    .replace(/\b(to\s+)?write\b/gi, 'écrire')
    .replace(/\b(to\s+)?buy\b/gi, 'acheter')
    .replace(/\b(to\s+)?sell\b/gi, 'vendre')
    .replace(/\b(to\s+)?work\b/gi, 'travailler')
    .replace(/\b(to\s+)?go\b/gi, 'aller')
    .replace(/\b(to\s+)?come\b/gi, 'venir')
    .replace(/\b(to\s+)?give\b/gi, 'donner')
    .replace(/\b(to\s+)?take\b/gi, 'prendre')
    .replace(/\b(to\s+)?make\b/gi, 'faire')
    .replace(/\b(to\s+)?do\b/gi, 'faire')
    .replace(/\b(to\s+)?have\b/gi, 'avoir')
    .replace(/\b(to\s+)?be\b/gi, 'être')
    .replace(/\b(to\s+)?want\b/gi, 'vouloir')
    .replace(/\b(to\s+)?know\b/gi, 'savoir / connaître')
    .replace(/\b(to\s+)?think\b/gi, 'penser')
    .replace(/\b(to\s+)?feel\b/gi, 'ressentir')
    .replace(/\b(to\s+)?find\b/gi, 'trouver')
    .replace(/\b(to\s+)?tell\b/gi, 'dire / raconter')
    .replace(/\b(to\s+)?ask\b/gi, 'demander')
    .replace(/\b(to\s+)?try\b/gi, 'essayer')
    .replace(/\b(to\s+)?need\b/gi, 'avoir besoin de')
    .replace(/\b(to\s+)?use\b/gi, 'utiliser')
    .replace(/\b(to\s+)?help\b/gi, 'aider')
    .replace(/\b(to\s+)?call\b/gi, 'appeler')
    .replace(/\b(to\s+)?start\b/gi, 'commencer')
    .replace(/\b(to\s+)?finish\b/gi, 'finir')
    .replace(/\b(to\s+)?stop\b/gi, 'arrêter')
    .replace(/\b(to\s+)?show\b/gi, 'montrer')
    .replace(/\b(to\s+)?hear\b/gi, 'entendre')
    .replace(/\b(to\s+)?play\b/gi, 'jouer')
    .replace(/\b(to\s+)?run\b/gi, 'courir')
    .replace(/\b(to\s+)?move\b/gi, 'bouger')
    .replace(/\b(to\s+)?live\b/gi, 'vivre')
    .replace(/\b(to\s+)?believe\b/gi, 'croire')
    .replace(/\b(to\s+)?bring\b/gi, 'apporter')
    .replace(/\b(to\s+)?happen\b/gi, 'se passer')
    .replace(/\b(to\s+)?must\b/gi, 'devoir')
    .replace(/\b(to\s+)?write\b/gi, 'écrire')
    .replace(/\b(to\s+)?provide\b/gi, 'fournir')
    .replace(/\b(to\s+)?sit\b/gi, 's’asseoir')
    .replace(/\b(to\s+)?stand\b/gi, 'se lever')
    .replace(/\b(to\s+)?lose\b/gi, 'perdre')
    .replace(/\b(to\s+)?pay\b/gi, 'payer')
    .replace(/\b(to\s+)?meet\b/gi, 'rencontrer')
    .replace(/\b(to\s+)?include\b/gi, 'inclure')
    .replace(/\b(to\s+)?continue\b/gi, 'continuer')
    .replace(/\b(to\s+)?set\b/gi, 'poser / régler')
    .replace(/\b(to\s+)?learn\b/gi, 'apprendre')
    .replace(/\b(to\s+)?change\b/gi, 'changer')
    .replace(/\b(to\s+)?lead\b/gi, 'mener')
    .replace(/\b(to\s+)?understand\b/gi, 'comprendre')
    .replace(/\b(to\s+)?watch\b/gi, 'regarder')
    .replace(/\b(to\s+)?follow\b/gi, 'suivre')
    .replace(/\b(to\s+)?create\b/gi, 'créer')
    .replace(/\b(to\s+)?speak\b/gi, 'parler')
    .replace(/\b(to\s+)?read\b/gi, 'lire')
    .replace(/\b(to\s+)?allow\b/gi, 'permettre')
    .replace(/\b(to\s+)?add\b/gi, 'ajouter')
    .replace(/\b(to\s+)?spend\b/gi, 'dépenser / passer du temps')
    .replace(/\b(to\s+)?grow\b/gi, 'grandir')
    .replace(/\b(to\s+)?open\b/gi, 'ouvrir')
    .replace(/\b(to\s+)?walk\b/gi, 'marcher')
    .replace(/\b(to\s+)?win\b/gi, 'gagner')
    .replace(/\b(to\s+)?offer\b/gi, 'offrir')
    .replace(/\b(to\s+)?remember\b/gi, 'se souvenir')
    .replace(/\b(to\s+)?love\b/gi, 'aimer')
    .replace(/\b(to\s+)?consider\b/gi, 'considérer')
    .replace(/\b(to\s+)?appear\b/gi, 'apparaître')
    .replace(/\b(to\s+)?buy\b/gi, 'acheter')
    .replace(/\b(to\s+)?wait\b/gi, 'attendre')
    .replace(/\b(to\s+)?serve\b/gi, 'servir')
    .replace(/\b(to\s+)?die\b/gi, 'mourir')
    .replace(/\b(to\s+)?send\b/gi, 'envoyer')
    .replace(/\b(to\s+)?expect\b/gi, 's’attendre à')
    .replace(/\b(to\s+)?build\b/gi, 'bâtir')
    .replace(/\b(to\s+)?stay\b/gi, 'rester')
    .replace(/\b(to\s+)?fall\b/gi, 'tomber')
    .replace(/\b(to\s+)?cut\b/gi, 'couper')
    .replace(/\b(to\s+)?reach\b/gi, 'atteindre')
    .replace(/\b(to\s+)?kill\b/gi, 'tuer')
    .replace(/\b(to\s+)?remain\b/gi, 'demeurer')
    .replace(/\b(to\s+)?suggest\b/gi, 'suggérer')
    .replace(/\b(to\s+)?raise\b/gi, 'élever / augmenter')
    .replace(/\b(to\s+)?pass\b/gi, 'passer')
    .replace(/\b(to\s+)?sell\b/gi, 'vendre')
    .replace(/\b(to\s+)?require\b/gi, 'exiger')
    .replace(/\b(to\s+)?report\b/gi, 'rapporter / signaler')
    .replace(/\b(to\s+)?decide\b/gi, 'décider')
    .replace(/\b(to\s+)?pull\b/gi, 'tirer')
    .replace(/\b(to\s+)?return\b/gi, 'retourner / revenir')
    .replace(/\b(to\s+)?explain\b/gi, 'expliquer')
    .replace(/\b(to\s+)?hope\b/gi, 'espérer')
    .replace(/\b(to\s+)?develop\b/gi, 'développer')
    .replace(/\b(to\s+)?carry\b/gi, 'porter')
    .replace(/\b(to\s+)?break\b/gi, 'casser')
    .replace(/\b(to\s+)?receive\b/gi, 'recevoir')
    .replace(/\b(to\s+)?agree\b/gi, 'convenir / être d’accord')
    .replace(/\b(to\s+)?support\b/gi, 'soutenir')
    .replace(/\b(to\s+)?hit\b/gi, 'frapper')
    .replace(/\b(to\s+)?produce\b/gi, 'produire')
    .replace(/\b(to\s+)?cover\b/gi, 'couvrir')
    .replace(/\b(to\s+)?catch\b/gi, 'attraper')
    .replace(/\b(to\s+)?draw\b/gi, 'dessiner / tirer')
    .replace(/\b(to\s+)?choose\b/gi, 'choisir');

  // Grammatical markers
  res = res
    .replace(/surname\s+[a-z]+/gi, '(Nom de famille)')
    .replace(/modal particle/gi, 'Particule modale')
    .replace(/particle/gi, 'Particule')
    .replace(/classifier\s+for/gi, 'Classificateur pour')
    .replace(/measure word/gi, 'Spécificatif')
    .replace(/interjection/gi, 'Interjection')
    .replace(/exclamation/gi, 'Exclamation')
    .replace(/onomatopoeia/gi, 'Onomatopée');

  // Format capitalized
  return res.trim().charAt(0).toUpperCase() + res.trim().slice(1);
}

function translateMeaningList(meanings) {
  if (!meanings || meanings.length === 0) return 'Terme standardisé HSK';
  
  const frList = [];
  for (let m of meanings) {
    const subParts = m.split(/[\/;]/).map(x => x.trim()).filter(Boolean);
    for (let sp of subParts) {
      const translated = translateWord(sp);
      if (translated && !frList.includes(translated)) {
        frList.push(translated);
      }
    }
  }

  return frList.slice(0, 3).join(' / ') || 'Terme officiel HSK';
}

function getBestForm(entry) {
  if (!entry.forms || entry.forms.length === 0) {
    return { pinyin: '', meanings: [] };
  }
  let best = entry.forms[0];
  if (entry.forms.length > 1) {
    const nonSurname = entry.forms.find(f => {
      const m0 = (f.meanings && f.meanings[0]) ? f.meanings[0].toLowerCase() : '';
      return !m0.startsWith('surname') && !m0.startsWith('(archaic)');
    });
    if (nonSurname) best = nonSurname;
  }
  return {
    pinyin: best.transcriptions?.pinyin || '',
    meanings: best.meanings || []
  };
}

function determineCategory(pos, meanings, level) {
  const m = meanings.join(' ').toLowerCase();
  if (m.includes('contract') || m.includes('law') || m.includes('legal') || m.includes('arbitrat')) return 'Droit & Juridique';
  if (m.includes('money') || m.includes('bank') || m.includes('tax') || m.includes('price') || m.includes('cost') || m.includes('profit') || m.includes('credit')) return 'Finance & Banque';
  if (m.includes('ship') || m.includes('port') || m.includes('custom') || m.includes('freight') || m.includes('container') || m.includes('deliver') || m.includes('transport')) return 'Logistique & Douane';
  if (m.includes('buy') || m.includes('sell') || m.includes('market') || m.includes('business') || m.includes('trade') || m.includes('company') || m.includes('order') || m.includes('negotiat')) return 'Commerce & Négociation';
  if (m.includes('inspect') || m.includes('quality') || m.includes('standard') || m.includes('test') || m.includes('guarantee')) return 'Contrôle Qualité';
  if (m.includes('factory') || m.includes('machine') || m.includes('material') || m.includes('product') || m.includes('manufactur')) return 'Production & Usine';
  if (m.includes('manage') || m.includes('plan') || m.includes('meeting') || m.includes('report') || m.includes('team') || m.includes('organize')) return 'Management & Stratégie';
  if (m.includes('say') || m.includes('speak') || m.includes('talk') || m.includes('call') || m.includes('email') || m.includes('letter') || m.includes('welcome')) return 'Communication';
  
  return `Référentiel HSK ${level}`;
}

const masterIdSet = new Set();
const levelsConfig = [
  { level: 1, cefr: 'A1', desc: 'Liste officielle standardisée de l’intégralité des mots du HSK 1 (Source: complete-hsk-vocabulary).' },
  { level: 2, cefr: 'A2', desc: 'Liste officielle standardisée de l’intégralité des mots du HSK 2 (Source: complete-hsk-vocabulary).' },
  { level: 3, cefr: 'B1', desc: 'Liste officielle standardisée de l’intégralité des mots du HSK 3 (Source: complete-hsk-vocabulary).' },
  { level: 4, cefr: 'B2', desc: 'Liste officielle standardisée de l’intégralité des mots du HSK 4 (Source: complete-hsk-vocabulary).' },
  { level: 5, cefr: 'C1', desc: 'Liste officielle standardisée de l’intégralité des mots du HSK 5 (Source: complete-hsk-vocabulary).' },
  { level: 6, cefr: 'C2', desc: 'Liste officielle standardisée de l’intégralité des mots du HSK 6 (Source: complete-hsk-vocabulary).' },
];

const targetDirs = [
  path.resolve('/Users/tossoumawutoespoirjudicael/Desktop/Espoir Chinois SAAS/content'),
  path.resolve('/Users/tossoumawutoespoirjudicael/Desktop/Espoir Chinois SAAS/app/src/content')
];

let grandTotal = 0;

levelsConfig.forEach(({ level, cefr, desc }) => {
  const sourcePath = `/tmp/complete-hsk-vocabulary/wordlists/exclusive/old/${level}.json`;
  const rawEntries = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  const processedVocab = rawEntries.map((entry, idx) => {
    const id = `hsk${level}_${String(idx + 1).padStart(4, '0')}`;
    
    if (masterIdSet.has(id)) {
      throw new Error(`DUPLICATE ID DETECTED: ${id}`);
    }
    masterIdSet.add(id);

    const hanzi = entry.simplified;
    const { pinyin, meanings } = getBestForm(entry);
    const french = translateMeaningList(meanings);
    const category = determineCategory(entry.pos, meanings, level);
    const businessTip = `Terme officiel standardisé du HSK ${level} essentiel pour les échanges et examens officiels.`;

    return {
      id,
      hanzi,
      pinyin,
      french,
      level: `HSK ${level}`,
      cefrLevel: cefr,
      category,
      businessTip,
      exampleHanzi: `${hanzi}是HSK ${level}重点必考词汇。`,
      examplePinyin: `${pinyin} shì HSK ${level} zhòngdiǎn bì kǎo cíhuì.`,
      exampleFrench: `« ${french} » est un vocabulaire officiel indispensable du HSK ${level}.`
    };
  });

  grandTotal += processedVocab.length;

  const finalJson = {
    meta: {
      niveau: `HSK ${level}`,
      cefr: cefr,
      totalOfficiel: processedVocab.length,
      source: "https://github.com/drkameleon/complete-hsk-vocabulary (wordlists/exclusive/old)",
      statiqueEtFixe: true,
      description: desc
    },
    vocabulaire: processedVocab
  };

  targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, `vocabulaire-hsk${level}.json`);
    fs.writeFileSync(outPath, JSON.stringify(finalJson, null, 2), 'utf8');
  });

  console.log(`✓ HSK ${level}: ${processedVocab.length} words with French translations and unique IDs.`);
});

console.log(`\n========================================`);
console.log(`TOTAL WORDS IMPORTED: ${grandTotal}`);
console.log(`UNIQUE IDS IN SYSTEM: ${masterIdSet.size}`);
console.log(`ZERO DUPLICATES CONFIRMED: ${grandTotal === masterIdSet.size}`);
console.log(`========================================\n`);
