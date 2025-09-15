// Base de données CSP Pneu - Catalogue complet
// Cette structure remplacera les données d'exemple

export interface TireProduct {
  id: string;
  reference: string;
  marque: string;
  modele: string;
  dimension: string;
  largeur: number;
  hauteur: number;
  diametre: number;
  indiceCharge: string;
  indiceVitesse: string;
  prixUnitaire: number;
  prixPromo?: number;
  stock: number;
  enStock: boolean;
  categorie: string;
  saison: 'Été' | 'Hiver' | 'Toutes saisons';
  runflat: boolean;
  reinforced: boolean;
  tubeless: boolean;
  description: string;
  caracteristiques: string[];
  dateAjout: string;
  image?: string;
}

// Données réalistes basées sur les marques principales
export const cspCatalog: TireProduct[] = [
  {
    id: "CSP_001",
    reference: "MICH_PS4_205_55_16",
    marque: "Michelin",
    modele: "Pilot Sport 4",
    dimension: "205/55 R16 91V",
    largeur: 205,
    hauteur: 55,
    diametre: 16,
    indiceCharge: "91",
    indiceVitesse: "V",
    prixUnitaire: 185,
    prixPromo: 165,
    stock: 15,
    enStock: true,
    categorie: "Sport",
    saison: "Été",
    runflat: false,
    reinforced: false,
    tubeless: true,
    description: "Pneu sport haute performance pour une adhérence optimale",
    caracteristiques: ["Adhérence à sec", "Freinage court", "Précision de conduite"],
    dateAjout: "2024-08-16",
    image: "/src/assets/tire-sample.jpg"
  },
  {
    id: "CSP_002",
    reference: "CONT_PC6_225_45_17",
    marque: "Continental",
    modele: "PremiumContact 6",
    dimension: "225/45 R17 94W",
    largeur: 225,
    hauteur: 45,
    diametre: 17,
    indiceCharge: "94",
    indiceVitesse: "W",
    prixUnitaire: 170,
    stock: 8,
    enStock: true,
    categorie: "Tourisme",
    saison: "Été",
    runflat: false,
    reinforced: false,
    tubeless: true,
    description: "Pneu premium alliant confort et performance",
    caracteristiques: ["Confort de roulage", "Faible bruit", "Économie de carburant"],
    dateAjout: "2024-08-15",
    image: "/src/assets/tire-sample.jpg"
  },
  {
    id: "CSP_003",
    reference: "BRID_T005_195_65_15",
    marque: "Bridgestone",
    modele: "Turanza T005",
    dimension: "195/65 R15 91H",
    largeur: 195,
    hauteur: 65,
    diametre: 15,
    indiceCharge: "91",
    indiceVitesse: "H",
    prixUnitaire: 145,
    prixPromo: 125,
    stock: 22,
    enStock: true,
    categorie: "Tourisme",
    saison: "Été",
    runflat: false,
    reinforced: false,
    tubeless: true,
    description: "Pneu écologique avec excellente durabilité",
    caracteristiques: ["Économie de carburant", "Durabilité", "Freinage sur mouillé"],
    dateAjout: "2024-08-14",
    image: "/src/assets/tire-sample.jpg"
  },
  {
    id: "CSP_004",
    reference: "PIRE_P7_215_60_16",
    marque: "Pirelli",
    modele: "Cinturato P7",
    dimension: "215/60 R16 95H",
    largeur: 215,
    hauteur: 60,
    diametre: 16,
    indiceCharge: "95",
    indiceVitesse: "H",
    prixUnitaire: 155,
    stock: 0,
    enStock: false,
    categorie: "Écologique",
    saison: "Été",
    runflat: false,
    reinforced: false,
    tubeless: true,
    description: "Pneu écologique haute performance",
    caracteristiques: ["Faible résistance", "Adhérence", "Respect environnement"],
    dateAjout: "2024-08-13",
    image: "/src/assets/tire-sample.jpg"
  },
  {
    id: "CSP_005",
    reference: "GOOD_EFF_185_60_14",
    marque: "Goodyear",
    modele: "EfficientGrip Performance",
    dimension: "185/60 R14 82H",
    largeur: 185,
    hauteur: 60,
    diametre: 14,
    indiceCharge: "82",
    indiceVitesse: "H",
    prixUnitaire: 95,
    stock: 31,
    enStock: true,
    categorie: "Économique",
    saison: "Été",
    runflat: false,
    reinforced: false,
    tubeless: true,
    description: "Pneu économique pour usage quotidien",
    caracteristiques: ["Bon rapport qualité-prix", "Kilométrage élevé", "Polyvalent"],
    dateAjout: "2024-08-12",
    image: "/src/assets/tire-sample.jpg"
  },
  {
    id: "CSP_006",
    reference: "HANK_K425_175_70_13",
    marque: "Hankook",
    modele: "Kinergy Eco K425",
    dimension: "175/70 R13 82T",
    largeur: 175,
    hauteur: 70,
    diametre: 13,
    indiceCharge: "82",
    indiceVitesse: "T",
    prixUnitaire: 78,
    prixPromo: 68,
    stock: 45,
    enStock: true,
    categorie: "Économique",
    saison: "Toutes saisons",
    runflat: false,
    reinforced: false,
    tubeless: true,
    description: "Pneu économique toutes saisons",
    caracteristiques: ["4 saisons", "Économique", "Bon kilométrage"],
    dateAjout: "2024-08-11",
    image: "/src/assets/tire-sample.jpg"
  }
];

// Fonctions utilitaires
export const getProductsByBrand = (brand: string) => 
  cspCatalog.filter(product => product.marque.toLowerCase() === brand.toLowerCase());

export const getProductsByDimension = (width: number, height: number, diameter: number) =>
  cspCatalog.filter(product => 
    product.largeur === width && 
    product.hauteur === height && 
    product.diametre === diameter
  );

export const getProductsInStock = () => 
  cspCatalog.filter(product => product.enStock);

export const getProductsOnSale = () => 
  cspCatalog.filter(product => product.prixPromo && product.prixPromo < product.prixUnitaire);

export const searchProducts = (query: string) =>
  cspCatalog.filter(product => 
    product.marque.toLowerCase().includes(query.toLowerCase()) ||
    product.modele.toLowerCase().includes(query.toLowerCase()) ||
    product.dimension.includes(query) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );