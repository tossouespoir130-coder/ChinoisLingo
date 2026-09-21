import 'server-only';

import { envoyerEmail, configurationEmailPrete } from './resend';
import { journaliserEmail } from './journal';

interface ParamsBienvenue {
  userId: string;
  email: string;
  nom: string;
  profil?: string | null;
  objectif?: string | null;
  niveau?: string | null;
}

export async function envoyerEmailBienvenue(params: ParamsBienvenue): Promise<boolean> {
  if (!configurationEmailPrete()) {
    console.warn('[emails] Resend non configuré : email de bienvenue simulé pour', params.email);
    await journaliserEmail({
      userId: params.userId,
      destinataire: params.email,
      sujet: `Bienvenue sur ChinoisLingo, ${params.nom} ! 🇨🇳 « Le chinois devient facile »`,
      type: 'bienvenue',
      statut: 'simule',
      erreur: 'RESEND_API_KEY ou EMAIL_EXPEDITEUR manquant',
    });
    return true;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://chinoislingo.com';
  const lienApp = `${siteUrl}/tableau-de-bord`;

  const profil = params.profil || 'Apprenant';
  const niveau = params.niveau || 'Débutant';
  const profilMin = profil.toLowerCase();
  const niveauMin = niveau.toLowerCase();
  const estDebutant = niveauMin.includes('début') || niveauMin.includes('debut');

  // Conseils et orientation personnalisés (tutoiement)
  let conseilSpecifique = 'Commence par découvrir les sons fondamentaux et les 150 premiers mots clés.';
  let parcoursRecommande = 'Pack Vocabulaire HSK 1 & Histoires courtes';

  if (profilMin.includes('entrepreneur') || profilMin.includes('commerc')) {
    if (estDebutant) {
      conseilSpecifique = 'Ta priorité : maîtriser les chiffres, les prix, la monnaie chinoise (RMB) et les formules de politesse commerciale avant de passer aux négociations.';
      parcoursRecommande = 'Mandarin Commercial & Négociation Débutant';
    } else {
      conseilSpecifique = 'Plonge directement dans nos masterclasses de sourcing et nos simulations de négociation à Guangzhou et Yiwu.';
      parcoursRecommande = 'Masterclass Sourcing Usines & Négociation';
    }
  } else if (profilMin.includes('cadre')) {
    if (estDebutant) {
      conseilSpecifique = 'Ta priorité : acquérir les présentations formelles, les formules de courtoisie et le vocabulaire essentiel du bureau.';
      parcoursRecommande = 'Politesse & Communication en Entreprise';
    } else {
      conseilSpecifique = 'Pratique les réunions de projet bilingues et la rédaction de communications professionnelles avec nos dialogues de travail.';
      parcoursRecommande = 'Management & Réunions d’Affaires';
    }
  } else if (profilMin.includes('ingénieur') || profilMin.includes('ingenieur') || profilMin.includes('technicien') || profilMin.includes('btp')) {
    if (estDebutant) {
      conseilSpecifique = 'Ta priorité : apprendre les consignes de sécurité, les mesures et les termes techniques de base pour échanger sur le terrain.';
      parcoursRecommande = 'Mandarin Technique, Chantier & Sécurité';
    } else {
      conseilSpecifique = 'Découvre notre lexique BTP, les dialogues d’atelier, la maintenance et la coordination de chantier.';
      parcoursRecommande = 'Vocabulaire BTP & Industrie Approfondi';
    }
  } else if (profilMin.includes('étudiant') || profilMin.includes('etudiant')) {
    if (estDebutant) {
      conseilSpecifique = 'Ta priorité : activer la Méthode de la Combinaison pour former des dizaines de phrases sans surcharge de mémorisation.';
      parcoursRecommande = 'Méthode de la Combinaison & Pack HSK 1';
    } else {
      conseilSpecifique = 'Prépare tes examens certifiants HSK 2 à 4 avec nos histoires et nos exercices d’écoute active.';
      parcoursRecommande = 'Préparation Certifiante HSK & Lectures';
    }
  }

  const sujet = `Bienvenue sur ChinoisLingo, ${params.nom} ! 🇨🇳 « Le chinois devient facile »`;

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
              <h2 style="font-size: 20px; font-weight: 700; color: #212121; margin: 0 0 16px 0;">
                Nǐhǎo ${params.nom} ! 👋
              </h2>
              <p style="font-size: 15px; line-height: 1.6; color: #424242; margin: 0 0 16px 0;">
                Je suis ravi de t'accueillir sur <strong>ChinoisLingo</strong>. Tu viens de faire le premier pas d'une aventure qui va changer ta vie !
              </p>

              <!-- Carte Récapitulative du Parcours Recommandé -->
              <div style="background-color: #F9F7FE; border-left: 4px solid #6200EE; border-radius: 12px; padding: 18px 20px; margin: 24px 0;">
                <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6200EE; letter-spacing: 1px; margin: 0 0 6px 0;">
                  🎯 Ton Parcours Personnalisé (${profil} • ${niveau})
                </p>
                <p style="font-size: 15px; font-weight: 700; color: #212121; margin: 0 0 8px 0;">
                  ${parcoursRecommande}
                </p>
                <p style="font-size: 13.5px; line-height: 1.5; color: #616161; margin: 0;">
                  ${conseilSpecifique}
                </p>
              </div>

              <!-- Les 3 clés de la réussite -->
              <h3 style="font-size: 15px; font-weight: 700; color: #212121; margin: 24px 0 12px 0;">
                💡 3 conseils pour progresser rapidement :
              </h3>
              <ul style="padding-left: 20px; margin: 0 0 24px 0; color: #424242; font-size: 14px; line-height: 1.7;">
                <li><strong>10 à 15 minutes par jour</strong> valent mieux que 2 heures une fois par semaine.</li>
                <li><strong>Écoute et répète à voix haute</strong> chaque phrase pour ancrer les 4 tons naturellement.</li>
                <li><strong>Explore la Méthode de la Combinaison</strong> pour construire tes propres phrases dès le premier jour.</li>
              </ul>

              <!-- Bouton d'action principal -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${lienApp}" target="_blank" style="display: inline-block; background-color: #6200EE; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 35px; border-radius: 100px; box-shadow: 0 4px 15px rgba(98, 0, 238, 0.3);">
                      Commencer ma première leçon →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; line-height: 1.6; color: #757575; margin: 25px 0 0 0; text-align: center;">
                Toute l'équipe sera à tes côtés tout au long de cette aventure. 加油 💪🏾
              </p>
            </td>
          </tr>

          <!-- Signature & Footer -->
          <tr>
            <td style="background-color: #FAFAFA; border-top: 1px solid #EAEAEA; padding: 25px 30px; text-align: center;">
              <p style="font-size: 13px; font-weight: 700; color: #212121; margin: 0;">
                Espoir Chinois
              </p>
              <p style="font-size: 12px; color: #757575; margin: 2px 0 12px 0;">
                Fondateur de ChinoisLingo
              </p>
              <p style="font-size: 11px; color: #9E9E9E; margin: 0;">
                © ${new Date().getFullYear()} ChinoisLingo. Tous droits réservés.
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
Bienvenue sur ChinoisLingo, ${params.nom} !
« Le chinois devient facile »

Nǐhǎo ${params.nom} !

Je suis ravi de t'accueillir sur ChinoisLingo. Tu viens de faire le premier pas d'une aventure qui va changer ta vie !

🎯 Ton Parcours Recommandé (${profil} • ${niveau}) :
${parcoursRecommande}
${conseilSpecifique}

💡 3 conseils pour progresser rapidement :
1. 10 à 15 minutes par jour valent mieux que 2 heures le week-end.
2. Écoute et répète à voix haute pour ancrer les 4 tons.
3. Teste la Méthode de la Combinaison pour parler dès le premier jour.

Commence ta première session ici : ${lienApp}

Toute l'équipe sera à tes côtés tout au long de cette aventure. 加油 💪🏾

Espoir Chinois,
Fondateur de ChinoisLingo
  `.trim();

  const resultat = await envoyerEmail({
    a: params.email,
    sujet,
    html,
    texte,
  });

  await journaliserEmail({
    userId: params.userId,
    destinataire: params.email,
    sujet,
    type: 'bienvenue',
    statut: resultat.ok ? 'envoye' : 'echec',
    resendId: resultat.ok ? resultat.id : undefined,
    erreur: !resultat.ok ? resultat.erreur : undefined,
  });

  return resultat.ok;
}
