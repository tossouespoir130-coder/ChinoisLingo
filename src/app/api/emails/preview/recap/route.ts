import { NextResponse } from 'next/server';
import { NOMS_RUBRIQUES, NOMS_SOUS_CATEGORIES, type NouvelItemContenu } from '@/lib/emails/emailRecapHebdo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(requete: Request) {
  const { searchParams } = new URL(requete.url);
  const nom = searchParams.get('nom') || 'Espoir Chinois';
  const profil = searchParams.get('profil') || 'Entrepreneur';
  const niveau = searchParams.get('niveau') || 'Débutant';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://chinoislingo.com';

  // Échantillon réel des ajouts récents (100% existants dans le catalogue)
  const contenusExemples: NouvelItemContenu[] = [
    {
      id: 'ep9_nego',
      rubrique: 'ecoute_lecture',
      sous_categorie: 'histoires',
      titre: 'Vie en Chine (Business) — Épisode 9 : Négocier les quantités et le prix des sacs',
      description: 'Katia négocie une commande de 100 sacs en trois couleurs (noir, rouge, bleu) et obtient une première remise fournisseur de 50 à 43 RMB.',
      lien: '/ecoute-lecture?type=histoires&id=vie_chine_business_ep9',
      niveau_hsk: 'HSK 1 - 2',
      profil_cible: 'Entrepreneur',
    },
    {
      id: 'chanson_tonghua',
      rubrique: 'ecoute_lecture',
      sous_categorie: 'chansons',
      titre: 'Chanson : 童话 (Conte de fées) — Michael Wong',
      description: 'L’une des plus célèbres ballades chinoises avec paroles synchronisées en Hanzi, Pinyin et Français, et audio immersif pour chanter vers par vers.',
      lien: '/ecoute-lecture?type=chansons&id=tonghua',
      niveau_hsk: 'HSK 2 - 3',
    },
    {
      id: 'vocab_methode_combinaison',
      rubrique: 'vocabulaire',
      sous_categorie: 'combinaison',
      titre: 'Méthode de la Combinaison : 150 Phrases Essentielles du Quotidien',
      description: 'Assemble 3 blocs modulaires (Sujet + Verbe & Modalité + Complément) pour composer plus de 200 phrases naturelles dès aujourd’hui.',
      lien: '/vocabulaire?tab=combinations',
      niveau_hsk: 'HSK 1',
    },
    {
      id: 'course_30_phrases',
      rubrique: 'formation',
      sous_categorie: 'videos',
      titre: '31 Phrases Essentielles pour Débuter en Chinois',
      description: 'Le guide pratique en 31 courtes vidéos animé par Espoir Chinois pour débloquer son expression orale, acquérir les réflexes essentiels et converser dès les premiers jours.',
      lien: '/formation',
      niveau_hsk: 'HSK 1',
    },
  ];

  const rubriquesMap: Record<string, NouvelItemContenu[]> = {};
  contenusExemples.forEach((item) => {
    if (!rubriquesMap[item.rubrique]) rubriquesMap[item.rubrique] = [];
    rubriquesMap[item.rubrique].push(item);
  });

  const ordreRubriques: ('vocabulaire' | 'ecoute_lecture' | 'formation' | 'livres')[] = [
    'vocabulaire',
    'ecoute_lecture',
    'formation',
    'livres',
  ];

  let sectionsHtml = '';
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
    });

    sectionsHtml += `</table></div>`;
  });

  const sujet = `Nouveautés de la semaine sur ChinoisLingo 🇨🇳 (« Le chinois devient facile »)`;

  const html = `<!DOCTYPE html>
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
              <a href="https://chinoislingo.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="/logo-white.png" alt="ChinoisLingo" width="180" style="display: block; margin: 0 auto 10px auto; max-width: 180px; height: auto; border: 0;" />
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
                Nǐhǎo ${nom} ! 👋
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
                    <a href="https://chinoislingo.com/tableau-de-bord" target="_blank" style="display: inline-block; background-color: #6200EE; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 35px; border-radius: 100px; box-shadow: 0 4px 15px rgba(98, 0, 238, 0.3);">
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
              <p style="font-size: 13px; font-weight: 700; color: #212121; margin: 0;">
                Espoir Chinois
              </p>
              <p style="font-size: 12px; color: #757575; margin: 2px 0 16px 0;">
                Fondateur de ChinoisLingo
              </p>
              <p style="font-size: 11px; color: #9E9E9E; margin: 0 0 6px 0;">
                Tu reçois cet e-mail car tu es inscrit sur ChinoisLingo.
              </p>
              <p style="font-size: 11px; margin: 0;">
                <a href="https://chinoislingo.com/mon-compte?tab=preferences" style="color: #6200EE; text-decoration: underline;">
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
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
