/**
 * Modèles des e-mails d'abonnement Mobile Money.
 *
 * Styles en ligne et mise en page par tableaux : c'est la seule forme que
 * Gmail, Outlook et les applications mobiles affichent de façon fiable — ils
 * ignorent les feuilles de style et la plupart des mises en page modernes.
 *
 * Chaque modèle produit aussi une version texte, affichée par les clients qui
 * bloquent le HTML et prise en compte par les filtres anti-spam.
 *
 * Fonctions pures, sans réseau ni secret.
 */

import { formaterEcheance } from '@/lib/payments/subscription';
import { resumeOffreGratuite } from '@/lib/payments/acces';
import {
  PLANS,
  Plan,
  formaterMontant,
  prixMensuelEquivalent,
  economiePourcent,
} from '@/lib/payments/plans';

/**
 * Jours avant l'échéance où part chaque rappel. La tâche planifiée en déduit
 * ses fenêtres d'envoi, et l'e-mail de confirmation les annonce : les deux
 * restent donc toujours d'accord.
 */
export const JOURS_RAPPEL = { j7: 7, j3: 3 } as const;

export interface ContenuEmail {
  sujet: string;
  html: string;
  texte: string;
}

interface Destinataire {
  /** URL publique du site, sans barre finale. */
  base: string;
  /** `null` donne un simple « Bonjour, ». */
  prenom: string | null;
}

export interface DonneesConfirmation extends Destinataire {
  nomPlan: string;
  /** Montant déjà formaté, ex. « 8 888 FCFA ». */
  montant: string;
  finPeriode: Date;
  /** Jours offerts inclus dans la période ; 0 sans bonus. */
  bonusJours: number;
}

export interface DonneesRappel extends Destinataire {
  nomPlan: string;
  finPeriode: Date;
  joursRestants: number;
}

const CHEMIN_RENOUVELLEMENT = '/mon-compte?tab=subscription';

// ─────────────────────────────────────────────────────────────────────────
// Les trois e-mails
// ─────────────────────────────────────────────────────────────────────────

export function modeleConfirmation(d: DonneesConfirmation): ContenuEmail {
  const echeance = formaterEcheance(d.finPeriode);

  const lignes: [string, string][] = [
    ['Formule', d.nomPlan],
    ['Montant réglé', d.montant],
    ['Accès complet jusqu’au', echeance],
  ];
  if (d.bonusJours > 0) {
    lignes.push(['Bonus de bienvenue', `${d.bonusJours} jours offerts`]);
  }

  const sujet = 'Votre abonnement ChinoisLingo est activé 🎉';
  return {
    sujet,
    ...rendre({
      base: d.base,
      apercu: `Accès complet jusqu’au ${echeance}. Merci pour votre confiance !`,
      titre: 'Votre abonnement est activé 🎉',
      blocs: [
        { type: 'paragraphe', texte: salutation(d.prenom) },
        {
          type: 'paragraphe',
          texte:
            'Merci pour votre confiance ! Votre paiement Mobile Money a bien été reçu : tout le catalogue ChinoisLingo vous est désormais ouvert — le vocabulaire HSK 1 à 6, Écoute & Lecture et toutes les formations.',
        },
        { type: 'recapitulatif', lignes },
        {
          type: 'paragraphe',
          texte: `**Aucun prélèvement automatique** : un paiement Mobile Money ne se renouvelle pas tout seul. Pour que la fin de votre accès ne vous surprenne pas, nous vous écrirons **${JOURS_RAPPEL.j7} jours** puis **${JOURS_RAPPEL.j3} jours** avant l’échéance.`,
        },
      ],
      bouton: { libelle: 'Commencer à apprendre', chemin: '/tableau-de-bord' },
    }),
  };
}

export function modeleRappelJ7(d: DonneesRappel): ContenuEmail {
  const echeance = formaterEcheance(d.finPeriode);

  return {
    sujet: `Votre abonnement ChinoisLingo se termine dans ${delai(d.joursRestants)}`,
    ...rendre({
      base: d.base,
      apercu: `Renouvelez par Mobile Money pour garder l’accès complet après le ${echeance}.`,
      titre: `Votre accès complet se termine dans ${delai(d.joursRestants)}`,
      blocs: [
        { type: 'paragraphe', texte: salutation(d.prenom) },
        {
          type: 'paragraphe',
          texte: `Votre **${d.nomPlan}** prend fin le **${echeance}**. Comme il a été réglé par Mobile Money, il ne se renouvelle pas automatiquement.`,
        },
        {
          type: 'paragraphe',
          texte:
            'Renouveler dès maintenant ne vous fait perdre aucun jour : la nouvelle période s’ajoute à la fin de celle en cours. Les formules Mobile Money :',
        },
        { type: 'liste', elements: PLANS.map(ligneTarif) },
      ],
      bouton: { libelle: 'Renouveler mon abonnement', chemin: CHEMIN_RENOUVELLEMENT },
    }),
  };
}

export function modeleRappelJ3(d: DonneesRappel): ContenuEmail {
  const echeance = formaterEcheance(d.finPeriode);
  const dernierJour = d.joursRestants <= 1;

  return {
    sujet: dernierJour
      ? 'Dernier jour d’accès complet à ChinoisLingo'
      : `Plus que ${d.joursRestants} jours d’accès complet à ChinoisLingo`,
    ...rendre({
      base: d.base,
      apercu: `Votre ${d.nomPlan} prend fin le ${echeance}. Renouvelez en quelques instants par Mobile Money.`,
      titre: dernierJour
        ? 'Votre accès complet se termine dans moins de 24 heures'
        : `Plus que ${d.joursRestants} jours d’accès complet`,
      blocs: [
        { type: 'paragraphe', texte: salutation(d.prenom) },
        {
          type: 'paragraphe',
          texte: `Votre **${d.nomPlan}** prend fin le **${echeance}**. Sans renouvellement, votre compte repassera à l’offre gratuite, qui se limite à :`,
        },
        { type: 'liste', elements: resumeOffreGratuite() },
        {
          type: 'paragraphe',
          texte:
            'Rien ne sera perdu pour autant : votre progression et vos mots enregistrés restent sur votre compte, et vous retrouverez tout le catalogue dès votre renouvellement.',
        },
      ],
      bouton: { libelle: 'Renouveler maintenant', chemin: CHEMIN_RENOUVELLEMENT },
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Formulations
// ─────────────────────────────────────────────────────────────────────────

function salutation(prenom: string | null): string {
  return prenom ? `Bonjour ${prenom},` : 'Bonjour,';
}

/** « 7 jours », ou « moins de 24 heures » la dernière journée. */
function delai(jours: number): string {
  return jours <= 1 ? 'moins de 24 heures' : `${jours} jours`;
}

/** « **Pass 6 Mois** : 39 999 FCFA, soit 6 667 FCFA par mois (−25 %) » */
function ligneTarif(plan: Plan): string {
  const prix = `**${plan.nom}** : ${formaterMontant(plan.montant.XOF, 'XOF')}`;
  const economie = economiePourcent(plan, 'XOF');
  return economie > 0
    ? `${prix}, soit ${prixMensuelEquivalent(plan, 'XOF')} par mois (−${economie} %)`
    : prix;
}

// ─────────────────────────────────────────────────────────────────────────
// Rendu HTML et texte
// ─────────────────────────────────────────────────────────────────────────

const VIOLET = '#6200EE';
const TURQUOISE = '#03DAC5';
const VERT_COCHE = '#00897B';
const TEXTE = '#212121';
const TEXTE_DOUX = '#424242';
const GRIS = '#757575';
const FOND = '#F4F1FB';
const FOND_ENCADRE = '#F7F3FF';
const POLICE = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const PIED =
  'Vous recevez cet e-mail car votre abonnement ChinoisLingo est réglé par Mobile Money.';

/** Contenu d'un e-mail, décrit une seule fois puis rendu en HTML et en texte. */
type Bloc =
  | { type: 'paragraphe'; texte: string }
  | { type: 'recapitulatif'; lignes: [libelle: string, valeur: string][] }
  | { type: 'liste'; elements: string[] };

interface Message {
  base: string;
  /** Aperçu affiché par la boîte de réception à côté du sujet. */
  apercu: string;
  titre: string;
  blocs: Bloc[];
  bouton: { libelle: string; chemin: string };
}

function echapper(valeur: string): string {
  return valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Typographie française : espace insécable avant « : ; ! ? % » et à
 * l'intérieur des guillemets, pour qu'un signe ne tombe jamais seul en début
 * de ligne sur un écran étroit.
 */
function typographie(texte: string): string {
  return texte.replace(/ ([:;!?%»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
}

/**
 * `**texte**` devient du gras. L'échappement a lieu AVANT : un prénom saisi
 * par l'apprenant ne peut donc pas injecter de balise dans l'e-mail.
 */
function enrichir(texte: string): string {
  return echapper(typographie(texte)).replace(
    /\*\*(.+?)\*\*/g,
    `<strong style="color:${TEXTE};">$1</strong>`
  );
}

function sansMarques(texte: string): string {
  return typographie(texte).replace(/\*\*(.+?)\*\*/g, '$1');
}

function blocHtml(bloc: Bloc): string {
  switch (bloc.type) {
    case 'paragraphe':
      return `<p style="margin:0 0 16px;font-family:${POLICE};font-size:15px;line-height:1.65;color:${TEXTE_DOUX};">${enrichir(bloc.texte)}</p>`;

    case 'recapitulatif':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px;background:${FOND_ENCADRE};border-radius:14px;">
<tr><td style="padding:12px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${bloc.lignes
  .map(
    ([libelle, valeur]) => `<tr>
<td style="padding:6px 12px 6px 0;font-family:${POLICE};font-size:13px;color:${GRIS};">${echapper(libelle)}</td>
<td align="right" style="padding:6px 0;font-family:${POLICE};font-size:14px;font-weight:700;color:${TEXTE};">${echapper(valeur)}</td>
</tr>`
  )
  .join('\n')}
</table>
</td></tr>
</table>`;

    case 'liste':
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
${bloc.elements
  .map(
    (element) => `<tr>
<td valign="top" style="padding:3px 10px 3px 0;font-family:${POLICE};font-size:15px;font-weight:700;color:${VERT_COCHE};">✓</td>
<td style="padding:3px 0;font-family:${POLICE};font-size:15px;line-height:1.5;color:${TEXTE_DOUX};">${enrichir(element)}</td>
</tr>`
  )
  .join('\n')}
</table>`;
  }
}

function blocTexte(bloc: Bloc): string {
  switch (bloc.type) {
    case 'paragraphe':
      return sansMarques(bloc.texte);
    case 'recapitulatif':
      return bloc.lignes.map(([libelle, valeur]) => `${libelle} : ${valeur}`).join('\n');
    case 'liste':
      return bloc.elements.map((element) => `  ✓ ${sansMarques(element)}`).join('\n');
  }
}

function rendre(m: Message): { html: string; texte: string } {
  const urlBouton = `${m.base}${m.bouton.chemin}`;
  const urlCompte = `${m.base}${CHEMIN_RENOUVELLEMENT}`;

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${echapper(m.titre)}</title>
</head>
<body style="margin:0;padding:0;background:${FOND};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${echapper(m.apercu)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FOND};">
<tr><td align="center" style="padding:32px 12px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;">
<tr><td style="height:6px;line-height:6px;font-size:0;background-color:${VIOLET};background-image:linear-gradient(90deg,${VIOLET},${TURQUOISE});">&nbsp;</td></tr>
<tr><td align="center" style="padding:32px 32px 8px;">
<a href="${m.base}" style="text-decoration:none;"><img src="${m.base}/chinoislingo-logo.png" width="168" alt="ChinoisLingo" style="display:block;width:168px;max-width:100%;height:auto;border:0;"></a>
</td></tr>
<tr><td style="padding:20px 32px 4px;">
<h1 style="margin:0 0 18px;font-family:${POLICE};font-size:22px;line-height:1.3;font-weight:800;color:${TEXTE};">${echapper(m.titre)}</h1>
${m.blocs.map(blocHtml).join('\n')}
</td></tr>
<tr><td align="center" style="padding:8px 32px 28px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="${VIOLET}" style="border-radius:999px;">
<a href="${urlBouton}" style="display:inline-block;padding:14px 34px;font-family:${POLICE};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">${echapper(m.bouton.libelle)}</a>
</td>
</tr></table>
</td></tr>
<tr><td style="padding:0 32px 32px;font-family:${POLICE};font-size:15px;line-height:1.6;color:${TEXTE_DOUX};">
À très vite,<br><strong style="color:${TEXTE};">L’équipe ChinoisLingo</strong>
</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
<tr><td align="center" style="padding:20px 16px 8px;font-family:${POLICE};font-size:12px;line-height:1.6;color:${GRIS};">
<strong style="color:${VIOLET};">ChinoisLingo</strong> — Le chinois devient facile<br>
${echapper(PIED)}<br>
<a href="${urlCompte}" style="color:${GRIS};text-decoration:underline;">Gérer mon abonnement</a>
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;

  const texte = [
    m.titre,
    '',
    ...m.blocs.flatMap((bloc) => [blocTexte(bloc), '']),
    `${m.bouton.libelle} : ${urlBouton}`,
    '',
    'À très vite,',
    'L’équipe ChinoisLingo',
    '',
    '—',
    'ChinoisLingo — Le chinois devient facile',
    PIED,
    `Gérer mon abonnement : ${urlCompte}`,
  ].join('\n');

  return { html, texte };
}
