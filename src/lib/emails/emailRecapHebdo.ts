import 'server-only';

import { envoyerEmail, configurationEmailPrete } from './resend';
import { journaliserEmail } from './journal';
import { lienDesabonnement } from './desabonnement';

export interface NouvelItemContenu {
  id: string;
  rubrique: 'vocabulaire' | 'ecoute_lecture' | 'formation' | 'livres';
  sous_categorie?: string | null;
  titre: string;
  description?: string | null;
  lien: string;
  niveau_hsk?: string | null;
  profil_cible?: string | null;
}

interface ParamsRecapHebdo {
  userId: string;
  email: string;
  nom: string;
  profil?: string | null;
  niveau?: string | null;
  contenus: NouvelItemContenu[];
}

const NOMS_RUBRIQUES: Record<string, string> = {
  vocabulaire: '📚 Vocabulaire & Méthode Combinatoire',
  ecoute_lecture: '🎧 Écoute & Lecture Active',
  formation: '🎓 Formations & Masterclasses',
  livres: '📖 Livres & Programmes VIP',
};

const NOMS_SOUS_CATEGORIES: Record<string, string> = {
  chansons: '🎵 Chansons Bilingues',
  articles: '📰 Articles de Presse & Société',
  histoires: '📖 Histoires & Contes Narrés',
  dialogues: '💬 Dialogues Immersifs',
  podcasts: '🎙️ Podcasts Thématiques',
  videos: '🎬 Vidéos Scénarisées',
  packs_hsk: '📚 Packs Vocabulaire HSK',
  combinaison: '💡 Combinaison de Mots Pivots',
  masterclass: '🎓 Masterclasses Pratiques',
  ouvrages: '📖 Guides & Lexiques Professionnels',
};

export async function envoyerEmailRecapHebdo(params: ParamsRecapHebdo): Promise<boolean> {
  // Si aucun contenu n'a été ajouté cette semaine, on n'envoie rien (règle stricte)
  if (!params.contenus || params.contenus.length === 0) {
    return false;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://chinoislingo.com';
  const liensDesabo = lienDesabonnement(siteUrl, params.userId);

  const profil = params.profil || 'Apprenant';
  const niveau = params.niveau || 'Débutant';
  const profilMin = profil.toLowerCase();
  const niveauMin = niveau.toLowerCase();
  const estDebutant = niveauMin.includes('début') || niveauMin.includes('debut');

  // Phrases d'encouragement personnalisées selon profil et niveau
  let phraseEncouragement = 'Chaque minute consacrée au mandarin renforce vos réflexes et vous rapproche de la fluidité naturelle.';
  let conseilNiveau = 'Prenez le temps d’écouter chaque phrase et de répéter à voix haute.';

  if (estDebutant) {
    conseilNiveau = 'Conseil débutant : Concentrez-vous d’abord sur les mots et dialogues de base (HSK 1) avant d’explorer les contenus plus avancés.';
  } else {
    conseilNiveau = 'Conseil intermédiaire/avancé : Testez votre compréhension sans afficher le pinyin au premier passage pour stimuler votre écoute active.';
  }

  if (profilMin.includes('entrepreneur') || profilMin.includes('commerc')) {
    phraseEncouragement = 'Votre maîtrise du chinois est un avantage concurrentiel décisif pour négocier directement avec les fabricants en Chine sans intermédiaire.';
  } else if (profilMin.includes('ingenieur') || profilMin.includes('technicien') || profilMin.includes('btp')) {
    phraseEncouragement = 'La précision technique combinée au vocabulaire chinois du terrain facilitera grandement vos coordinations sur les projets et chantiers.';
  } else if (profilMin.includes('cadre')) {
    phraseEncouragement = 'Comprendre les subtilités de la communication d’entreprise chinoise valorise votre leadership international et vos relations de travail.';
  } else if (profilMin.includes('etudiant')) {
    phraseEncouragement = 'La régularité est votre meilleur allié : chaque nouveau caractère assimilé est un point de gagné pour votre future certification HSK.';
  }

  // Regroupement hiérarchique strict par rubrique
  const ordreRubriques: ('vocabulaire' | 'ecoute_lecture' | 'formation' | 'livres')[] = [
    'vocabulaire',
    'ecoute_lecture',
    'formation',
    'livres',
  ];

  const rubriquesMap: Record<string, NouvelItemContenu[]> = {};
  params.contenus.forEach((item) => {
    if (!rubriquesMap[item.rubrique]) {
      rubriquesMap[item.rubrique] = [];
    }
    rubriquesMap[item.rubrique].push(item);
  });

  // Construction des sections HTML
  let sectionsHtml = '';
  let sectionsTexte = '';

  ordreRubriques.forEach((rub) => {
    const items = rubriquesMap[rub];
    if (!items || items.length === 0) return;

    const nomRubrique = NOMS_RUBRIQUES[rub] || rub;
    sectionsHtml += `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #6200EE; margin: 0 0 12px 0; border-bottom: 2px solid #6200EE/15; padding-bottom: 6px;">
          ${nomRubrique}
        </h3>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
    `;
    sectionsTexte += `\n--- ${nomRubrique} ---\n`;

    // Regrouper par sous-catégorie si écoute & lecture
    items.forEach((item) => {
      const sousCatLabel = item.sous_categorie ? `[${NOMS_SOUS_CATEGORIES[item.sous_categorie] || item.sous_categorie}] ` : '';
      const badgeHsk = item.niveau_hsk ? ` • ${item.niveau_hsk}` : '';
      const lienComplet = item.lien.startsWith('http') ? item.lien : `${siteUrl}${item.lien}`;

      sectionsHtml += `
        <li style="margin-bottom: 12px; padding: 12px 14px; background-color: #FAFAFA; border: 1px solid #EAEAEA; border-radius: 12px;">
          <a href="${lienComplet}" target="_blank" style="font-size: 14.5px; font-weight: 700; color: #212121; text-decoration: none;">
            ${sousCatLabel}${item.titre} <span style="font-size: 12px; color: #00897B; font-weight: 600;">${badgeHsk}</span> →
          </a>
          ${item.description ? `<p style="font-size: 12.5px; color: #616161; margin: 4px 0 0 0; line-height: 1.4;">${item.description}</p>` : ''}
        </li>
      `;

      sectionsTexte += `• ${sousCatLabel}${item.titre}${badgeHsk} : ${lienComplet}\n`;
      if (item.description) sectionsTexte += `  ${item.description}\n`;
    });

    sectionsHtml += `</ul></div>`;
  });

  const sujet = `Nouveautés de la semaine sur ChinoisLingo 🇨🇳 (« Le chinois devient facile »)`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${sujet}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #212121;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F6FB; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(98, 0, 238, 0.06); border: 1px solid #EAEAEA;">
          <!-- En-tête Violet -->
          <tr>
            <td style="background: linear-gradient(135deg, #6200EE 0%, #4A00B4 100%); padding: 30px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0;">ChinoisLingo</h1>
              <p style="color: #03DAC5; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 6px 0 0 0;">
                « Le chinois devient facile »
              </p>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="font-size: 19px; font-weight: 700; color: #212121; margin: 0 0 14px 0;">
                Bonjour ${params.nom} ! 👋
              </h2>
              <p style="font-size: 14.5px; line-height: 1.6; color: #424242; margin: 0 0 18px 0;">
                Voici les nouveaux contenus et leçons ajoutés sur la plateforme cette semaine pour enrichir votre immersion en mandarin.
              </p>

              <!-- Conseil Niveau & Profil -->
              <div style="background-color: #E8F5E9; border-left: 4px solid #00897B; border-radius: 10px; padding: 14px 16px; margin: 0 0 24px 0;">
                <p style="font-size: 13px; font-weight: 600; color: #00796B; margin: 0;">
                  💡 ${conseilNiveau}
                </p>
              </div>

              <!-- Liste des nouveautés par rubriques -->
              ${sectionsHtml}

              <!-- Bouton d'accès direct -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/tableau-de-bord" target="_blank" style="display: inline-block; background-color: #6200EE; color: #FFFFFF; font-size: 14.5px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 100px; box-shadow: 0 4px 12px rgba(98, 0, 238, 0.25);">
                      Découvrir mes nouveaux contenus →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Phrase d'encouragement motivante -->
              <div style="background-color: #FFF8E1; border-radius: 12px; padding: 16px; margin-top: 20px; text-align: center;">
                <p style="font-size: 13.5px; font-weight: 600; color: #F57F17; margin: 0; line-height: 1.5;">
                  🔥 ${phraseEncouragement}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer & Désabonnement -->
          <tr>
            <td style="background-color: #FAFAFA; border-top: 1px solid #EAEAEA; padding: 25px 30px; text-align: center;">
              <p style="font-size: 13px; font-weight: 700; color: #212121; margin: 0;">
                Espoir Chinois
              </p>
              <p style="font-size: 12px; color: #757575; margin: 2px 0 16px 0;">
                Fondateur de ChinoisLingo
              </p>
              <p style="font-size: 11px; color: #9E9E9E; margin: 0 0 6px 0;">
                Vous recevez cet e-mail car vous êtes inscrit sur ChinoisLingo.
              </p>
              <p style="font-size: 11px; margin: 0;">
                <a href="${liensDesabo.page}" style="color: #6200EE; text-decoration: underline;">
                  Gérer mes préférences de notification ou me désabonner
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const texte = `
Nouveautés de la semaine sur ChinoisLingo 🇨🇳
« Le chinois devient facile »

Bonjour ${params.nom} !

Voici les nouveaux contenus ajoutés sur ChinoisLingo cette semaine pour votre apprentissage :

${sectionsTexte}

💡 ${conseilNiveau}

Accédez à votre espace : ${siteUrl}/tableau-de-bord

🔥 ${phraseEncouragement}

Espoir Chinois,
Fondateur de ChinoisLingo

Pour ne plus recevoir ces récapitulatifs : ${liensDesabo.page}
  `.trim();

  if (!configurationEmailPrete()) {
    console.warn('[emails] Resend non configuré : récap hebdo simulé pour', params.email);
    await journaliserEmail({
      userId: params.userId,
      destinataire: params.email,
      sujet,
      type: 'recap_hebdo',
      statut: 'simule',
      erreur: 'RESEND_API_KEY ou EMAIL_EXPEDITEUR manquant',
    });
    return true;
  }

  const resultat = await envoyerEmail({
    a: params.email,
    sujet,
    html,
    texte,
    desabonnement: liensDesabo,
  });

  await journaliserEmail({
    userId: params.userId,
    destinataire: params.email,
    sujet,
    type: 'recap_hebdo',
    statut: resultat.ok ? 'envoye' : 'echec',
    resendId: resultat.ok ? resultat.id : undefined,
    erreur: !resultat.ok ? resultat.erreur : undefined,
  });

  return resultat.ok;
}
