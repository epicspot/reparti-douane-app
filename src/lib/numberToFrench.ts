// Conversion de nombres en lettres françaises
const UNITS = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"
];

const TENS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"];

function underHundred(n: number): string {
  if (n < 17) return UNITS[n];
  if (n < 20) return "dix-" + UNITS[n - 10];
  if (n < 70) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    const base = TENS[d];
    if (u === 1 && d !== 7 && d !== 9) return `${base} et un`;
    return u ? `${base}-${UNITS[u]}` : base;
  }
  if (n < 80) {
    if (n === 71) return "soixante et onze";
    return "soixante-" + underHundred(n - 60);
  }
  if (n === 80) return "quatre-vingts";
  return "quatre-vingt-" + underHundred(n - 80).replace("dix-un", "onze");
}

function underThousand(n: number): string {
  if (n < 100) return underHundred(n);
  const c = Math.floor(n / 100);
  const r = n % 100;
  const cent = c === 1 ? "cent" : UNITS[c] + " cent";
  if (r === 0) return cent + "s";
  return cent + " " + underHundred(r);
}

export function numberToFrench(n: number): string {
  if (n === 0) return "zéro";
  if (n < 0) return "moins " + numberToFrench(-n);
  
  const parts: string[] = [];
  const milliards = Math.floor(n / 1_000_000_000);
  n %= 1_000_000_000;
  const millions = Math.floor(n / 1_000_000);
  n %= 1_000_000;
  const milliers = Math.floor(n / 1000);
  const reste = n % 1000;
  
  if (milliards) {
    parts.push(milliards === 1 ? "un milliard" : `${underThousand(milliards)} milliards`);
  }
  if (millions) {
    parts.push(millions === 1 ? "un million" : `${underThousand(millions)} millions`);
  }
  if (milliers) {
    parts.push(milliers === 1 ? "mille" : `${underThousand(milliers)} mille`);
  }
  if (reste) {
    parts.push(underThousand(reste));
  }
  
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function montantEnLettresCFA(montant: number): string {
  const m = Math.floor(montant || 0);
  const base = numberToFrench(m);
  return `${base} francs CFA`.replace("un francs", "un franc");
}
