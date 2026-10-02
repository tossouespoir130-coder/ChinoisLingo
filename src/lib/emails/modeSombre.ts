import 'server-only';

/**
 * Compatibilité des e-mails avec le mode sombre des messageries.
 *
 * - Apple Mail / Outlook : respectent `color-scheme` et la media query
 *   `prefers-color-scheme: dark`, on y fournit une vraie palette sombre.
 * - Gmail (iOS / Android) : ignore la media query et inverse de force les
 *   couleurs. Il n'inverse pas les `background-image` : les fonds violets
 *   sont donc posés en dégradé pour rester violets. Le texte clair posé sur
 *   ces fonds est enveloppé dans `texteClairProtege()` (technique « blend »
 *   screen + difference) pour retrouver sa couleur d'origine.
 */

/** Balises `<meta>` + `<style>` à placer dans le `<head>` de chaque gabarit. */
export const ENTETE_MODE_SOMBRE = `
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    u + .corps .gmail-ecran { background: #000000; mix-blend-mode: screen; }
    u + .corps .gmail-difference { background: #000000; mix-blend-mode: difference; }
    @media (prefers-color-scheme: dark) {
      .fond-page { background-color: #121212 !important; }
      .carte { background-color: #1E1E1E !important; border-color: #2E2E2E !important; }
      .bloc { background-color: #262626 !important; border-color: #363636 !important; }
      .pied { background-color: #181818 !important; border-color: #2E2E2E !important; }
      .texte-titre { color: #F5F5F5 !important; }
      .texte-corps { color: #CFCFCF !important; }
      .texte-doux { color: #A0A0A0 !important; }
      .texte-violet { color: #B388FF !important; }
      .filet { border-color: #333333 !important; }
    }
  </style>`;

/** Fond violet de la marque, résistant à l'inversion de Gmail. */
export const FOND_VIOLET =
  'background-color: #6200EE; background-image: linear-gradient(135deg, #6200EE 0%, #4A00B4 100%);';

/** Protège un texte clair (blanc, turquoise) posé sur un fond violet contre l'inversion de Gmail. */
export function texteClairProtege(contenu: string): string {
  return `<span class="gmail-ecran"><span class="gmail-difference">${contenu}</span></span>`;
}

/** Bouton d'action principal (pilule violette, texte blanc) compatible mode sombre. */
export function boutonPrincipal(lien: string, libelle: string): string {
  return `
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0 10px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#6200EE" style="${FOND_VIOLET} border-radius: 100px;">
                          <a href="${lien}" target="_blank" style="display: inline-block; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 35px; border-radius: 100px;">
                            ${texteClairProtege(libelle)}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>`;
}

/**
 * En-tête violet commun : logo blanc (avec texte de remplacement lisible
 * quand la messagerie bloque les images) et slogan turquoise.
 */
export function enTeteMarque(siteUrl: string): string {
  return `
          <tr>
            <td bgcolor="#6200EE" style="${FOND_VIOLET} padding: 35px 30px; text-align: center;">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${siteUrl}/logo-white.png" alt="ChinoisLingo" width="180" style="display: block; margin: 0 auto 10px auto; max-width: 180px; height: auto; border: 0; color: #FFFFFF; font-size: 26px; font-weight: 800; line-height: 1.2;" />
              </a>
              <p style="color: #03DAC5; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">
                ${texteClairProtege('« Le chinois devient facile »')}
              </p>
            </td>
          </tr>`;
}
