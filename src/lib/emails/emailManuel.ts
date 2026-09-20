import 'server-only';

import { envoyerEmail, configurationEmailPrete } from './resend';
import { journaliserEmail } from './journal';

interface ParamsEmailManuel {
  destinataire: string;
  nomDestinataire?: string;
  sujet: string;
  message: string;
  userId?: string | null;
  adminId?: string;
}

export async function envoyerEmailManuel(params: ParamsEmailManuel): Promise<{ ok: boolean; erreur?: string; resendId?: string }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://chinoislingo.com';
  const nom = params.nomDestinataire || 'Apprenant';

  // Convertir le message avec sauts de ligne en paragraphes HTML propres
  const messageHtml = params.message
    .split('\n\n')
    .map((paragraphe) => `<p style="font-size: 15px; line-height: 1.6; color: #333333; margin: 0 0 16px 0;">${paragraphe.replace(/\n/g, '<br />')}</p>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${params.sujet}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #212121;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F6FB; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(98, 0, 238, 0.06); border: 1px solid #EAEAEA;">
          <!-- En-tête Violet Signature -->
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
            <td style="padding: 35px 30px;">
              <h2 style="font-size: 19px; font-weight: 700; color: #212121; margin: 0 0 18px 0;">
                Bonjour ${nom} ! 👋
              </h2>

              ${messageHtml}

              <!-- Bouton d'accès direct -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0 15px 0;">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/tableau-de-bord" target="_blank" style="display: inline-block; background-color: #6200EE; color: #FFFFFF; font-size: 14.5px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 100px; box-shadow: 0 4px 12px rgba(98, 0, 238, 0.25);">
                      Accéder à ChinoisLingo →
                    </a>
                  </td>
                </tr>
              </table>
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
ChinoisLingo — « Le chinois devient facile »

Bonjour ${nom} !

${params.message}

Accéder à votre compte : ${siteUrl}/tableau-de-bord

Espoir Chinois,
Fondateur de ChinoisLingo
  `.trim();

  if (!configurationEmailPrete()) {
    console.warn('[emails] Resend non configuré : email manuel simulé pour', params.destinataire);
    await journaliserEmail({
      userId: params.userId,
      destinataire: params.destinataire,
      sujet: params.sujet,
      type: 'manuel',
      statut: 'simule',
      erreur: 'RESEND_API_KEY ou EMAIL_EXPEDITEUR manquant',
      envoyePar: params.adminId || 'admin',
    });
    return { ok: true, resendId: 'simule_' + Date.now() };
  }

  const resultat = await envoyerEmail({
    a: params.destinataire,
    sujet: params.sujet,
    html,
    texte,
  });

  await journaliserEmail({
    userId: params.userId,
    destinataire: params.destinataire,
    sujet: params.sujet,
    type: 'manuel',
    statut: resultat.ok ? 'envoye' : 'echec',
    resendId: resultat.ok ? resultat.id : undefined,
    erreur: !resultat.ok ? resultat.erreur : undefined,
    envoyePar: params.adminId || 'admin',
  });

  return resultat;
}
