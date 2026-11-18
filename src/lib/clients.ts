/**
 * Real ZDL clients — used for the homepage trust strip (marquee) and
 * other social-proof surfaces. Keep in sync with scripts/portfolio-data.mjs
 * (which seeds the CMS). Ordered as the owner listed them.
 */
export interface ClientRef {
  name: string;
  domain: string;
  industry: string;
}

export const ZDL_CLIENTS: ClientRef[] = [
  { name: "Pawon Bhoga Catering", domain: "pawonbhoga.id", industry: "Kuliner" },
  { name: "KINSUROI", domain: "kinsuroi.com", industry: "Kecantikan" },
  { name: "Rajawali Motorcycle Rental", domain: "sewamotorjakarta.co.id", industry: "Transportasi" },
  { name: "Bettalover Express", domain: "kirimikanhias.com", industry: "Logistik" },
  { name: "Starlish Bimbel", domain: "bimbelstarlish.com", industry: "Edukasi" },
  { name: "Livia Real Estate", domain: "liviarealestate.asia", industry: "Properti" },
  { name: "Kementrian Sego's Bebek", domain: "kementriansegosbebek.id", industry: "Kuliner" },
  { name: "KOPIKIR", domain: "kopikir.store", industry: "Kuliner" },
  { name: "Park Serpong Legok", domain: "genesisxproperty.com", industry: "Properti" },
  { name: "Terradekor", domain: "terradekor.com", industry: "Interior" },
  { name: "Desain Home Living", domain: "designhomeliving.org", industry: "Interior" },
  { name: "Liana Home Interior", domain: "lianahomeinterior.com", industry: "Interior" },
  { name: "ALLIN", domain: "allin.web.id", industry: "Organisasi" },
  { name: "Pawon Bhoga .com", domain: "pawonbhoga.com", industry: "Kuliner" },
  { name: "H2 Sport Surabaya", domain: "lantaifutsalsurabaya.asia", industry: "Olahraga" },
  { name: "Migas Stell", domain: "migasstell.com", industry: "Industri" },
];
