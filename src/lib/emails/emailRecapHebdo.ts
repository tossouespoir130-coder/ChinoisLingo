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

export const NOMS_RUBRIQUES: Record<string, string> = {
  vocabulaire: 'Vocabulaire & Méthode de la Combinaison',
  ecoute_lecture: 'Écoute & Lecture Active',
  formation: 'Formations & Masterclasses',
  livres: 'Livres & Programmes VIP',
};

export const NOMS_SOUS_CATEGORIES: Record<string, string> = {
  chansons: 'Chansons Bilingues',
  articles: 'Articles de Presse & Société',
  histoires: 'Histoires & Contes Narrés',
  dialogues: 'Dialogues Immersifs',
  podcasts: 'Podcasts Thématiques',
  videos: 'Vidéos Scénarisées',
  packs_hsk: 'Packs Vocabulaire HSK',
  combinaison: 'Combinaison de Mots Pivots',
  masterclass: 'Masterclasses Pratiques',
  ouvrages: 'Guides & Lexiques Professionnels',
};

export async function envoyerEmailRecapHebdo(params: ParamsRecapHebdo): Promise<boolean> {
  // Si aucun contenu n'a été ajouté cette semaine, on n'envoie rien (règle stricte)
  if (!params.contenus || params.contenus.length === 0) {
    return false;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://chinoislingo.com';
  const liensDesabo = lienDesabonnement(siteUrl, params.userId);

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
    let iconeRubrique = '📖';
    if (rub === 'vocabulaire') iconeRubrique = '📚';
    else if (rub === 'ecoute_lecture') iconeRubrique = '🎧';
    else if (rub === 'formation') iconeRubrique = '🎬';
    else if (rub === 'livres') iconeRubrique = '💎';

    sectionsHtml += `
      <div style="margin-bottom: 26px;">
        <div style="margin-bottom: 12px; border-bottom: 2px solid #F0EDF9; padding-bottom: 6px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #6200EE; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
            ${iconeRubrique} ${nomRubrique}
          </h3>
        </div>
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
    `;
    sectionsTexte += `\n--- ${nomRubrique} ---\n`;

    items.forEach((item) => {
      const sousCatNom = item.sous_categorie ? (NOMS_SOUS_CATEGORIES[item.sous_categorie] || item.sous_categorie) : '';
      const badgeHsk = item.niveau_hsk || '';
      const lienComplet = item.lien.startsWith('http') ? item.lien : `${siteUrl}${item.lien}`;

      sectionsHtml += `
        <tr>
          <td style="padding-bottom: 12px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAFAFA; border: 1px solid #E8E8E8; border-radius: 14px; padding: 14px 16px;">
              <tr>
                <td>
                  <div style="margin-bottom: 6px;">
                    ${sousCatNom ? `<span style="display: inline-block; background-color: #EDE7F6; color: #6200EE; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-right: 6px; text-transform: uppercase;">${sousCatNom}</span>` : ''}
                    ${badgeHsk ? `<span style="display: inline-block; background-color: #E0F2F1; color: #00897B; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">${badgeHsk}</span>` : ''}
                  </div>
                  <a href="${lienComplet}" target="_blank" style="font-size: 15px; font-weight: 700; color: #212121; text-decoration: none; line-height: 1.4; display: block;">
                    ${item.titre}
                  </a>
                  ${item.description ? `<p style="font-size: 13px; color: #616161; margin: 6px 0 0 0; line-height: 1.45;">${item.description}</p>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;

      sectionsTexte += `• ${sousCatNom ? `[${sousCatNom}] ` : ''}${item.titre}${badgeHsk ? ` (${badgeHsk})` : ''} : ${lienComplet}\n`;
      if (item.description) sectionsTexte += `  ${item.description}\n`;
    });

    sectionsHtml += `</table></div>`;
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
          <!-- En-tête Violet Signature -->
          <tr>
            <td style="background: linear-gradient(135deg, #6200EE 0%, #4A00B4 100%); padding: 35px 30px; text-align: center;">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${siteUrl}/logo-white.png" alt="ChinoisLingo" width="180" style="display: block; margin: 0 auto 10px auto; max-width: 180px; height: auto; border: 0;" />
              </a>
              <p style="color: #03DAC5; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">
                « Le chinois devient facile »
              </p>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #212121; margin: 0 0 14px 0;">
                Nǐhǎo ${params.nom} ! 👋
              </h2>
              <p style="font-size: 15px; line-height: 1.6; color: #424242; margin: 0 0 24px 0;">
                Voici les nouveaux contenus et leçons ajoutés sur <strong>ChinoisLingo</strong> cette semaine pour accélérer ton immersion en mandarin.
              </p>

              <!-- Liste des nouveautés par rubriques -->
              ${sectionsHtml}

              <!-- Bouton d'accès direct -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/tableau-de-bord" target="_blank" style="display: inline-block; background-color: #6200EE; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 35px; border-radius: 100px; box-shadow: 0 4px 15px rgba(98, 0, 238, 0.3);">
                      Découvrir mes nouveaux contenus →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer & Désabonnement -->
          <tr>
            <td style="background-color: #FAFAFA; border-top: 1px solid #EAEAEA; padding: 25px 30px; text-align: center;">
              <p style="font-size: 13px; font-weight: 700; color: #212121; margin: 0 0 12px 0;">
                L'équipe ChinoisLingo
              </p>
              <p style="font-size: 11px; color: #9E9E9E; margin: 0 0 6px 0;">
                Tu reçois cet e-mail car tu es inscrit sur ChinoisLingo.
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

Nǐhǎo ${params.nom} !

Voici les nouveaux contenus ajoutés sur ChinoisLingo cette semaine pour ton apprentissage :

${sectionsTexte}

Accède à ton espace : ${siteUrl}/tableau-de-bord

L'équipe ChinoisLingo

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
