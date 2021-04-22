const NODE_TYPES = [
	{ value: "animal",	text: "Consumer (animal)",		type: "biotic",		swedish: "Konsument" },
	{ value: "plant",	text: "Producer (plant)",		type: "biotic",		swedish: "Producent" },
	{ value: "fungi",	text: "Decomposer (detrivore)",	type: "biotic",		swedish: "Nedbrytare" },
	{ value: "abiotic",	text: "Abiotic (non-living)",	type: "abiotic",	swedish: "Abiotisk" },
	{ value: "service",	text: "Ecosystem services",		type: "abiotic",	swedish: "Ekosystemtjänst" },
];

const NODE_IMAGES_PATH = "assets/images/nodes/serengeti/";
const NODE_IMAGES_PATH_SMALL = "assets/images/nodes/128/";
const NODE_IMAGES = [
	{ value: "missing",				text: "Missing.png" },

	// { value: "blåbär",				text: "Blåbär.png" },
	// { value: "daggmask",			text: "Daggmask.png" },
	// { value: "detrius",				text: "Detrius.png" },
	// { value: "dovhjort",			text: "Dovhjort.png" },
	// { value: "duvhök",				text: "Duvhök.png" },
	// { value: "fiskebåt",			text: "FiskeBåt.png" },
	// { value: "gräs",				text: "Gräs.png" },
	// { value: "hare",				text: "Hare.png" },
	// { value: "hasselnöt",			text: "Hasselnöt.png" },
	// { value: "havsfåglar",			text: "HavsFåglar.png" },
	// { value: "havsfisk",			text: "HavsFisk.png" },
	// { value: "havsutter",			text: "Havsutter.png" },
	// { value: "jättekelp",			text: "Jättekelp.png" },
	// { value: "kattuggla",			text: "Kattuggla.png" },
	// { value: "kelpfisk",			text: "KelpFisk.png" },
	// { value: "koltrast",			text: "Koltrast.png" },
	// { value: "lo",					text: "Lo.png" },
	// { value: "mussla",				text: "Mussla.png" },
	// { value: "norvacka",			text: "Norvacka.png" },
	// { value: "ormstjärna",			text: "Ormstjärna.png" },
	// { value: "öronsäl",				text: "Öronsäl.png" },
	// { value: "ört",					text: "Ört.png" },
	// { value: "pirål",				text: "Pirål.png" },
	// { value: "plankton",			text: "Plankton.png" },
	// { value: "rådjur",				text: "Rådjur.png" },
	// { value: "rankfoting",			text: "Rankfoting.png" },
	// { value: "räv",					text: "Räv.png" },
	// { value: "säl",					text: "Säl.png" },
	// { value: "sjöborre",			text: "Sjöborre.png" },
	// { value: "skalbagge",			text: "Skalbagge.png" },
	// { value: "skogssork_grasiding",	text: "Skogssork_Grasiding.png" },
	// { value: "snok",				text: "Snok.png" },
	// { value: "späckhuggare",		text: "Späckhuggare.png" },
	// { value: "svamp",				text: "Svamp.png" },
	// { value: "trädlevandeinsekt",	text: "TrädlevandeInsekt.png" },
	// { value: "träd",				text: "Träd.png" },
	// { value: "utterjägare",			text: "UtterJägare.png" },
	// { value: "valar",				text: "Valar.png" },
	// { value: "vanliggroda",			text: "VanligGroda.png" },
	// { value: "vithövdadhavsörn",	text: "VithövdadHavsörn.png" },

	// { value: "acalypha",				text: "Acalypha.png" },
	// { value: "equus_quagga",			text: "Equus_Quagga.png" },
	// { value: "heteropogon_contortus",	text: "Heteropogon_contortus.png" },
	// { value: "lycaon_picturus",			text: "Lycaon_Picturus.png" },
	// { value: "madoqua_kirkii",			text: "Madoqua_kirkii.png" },
	// { value: "panthera_leo",			text: "Panthera_leo.png" },

	// { value: "acalypha",				text: "Serengeti-P-acalypha.png" },
	// { value: "equus_quagga",			text: "Serengeti-H-zebra.png" },
	// { value: "heteropogon_contortus",	text: "Serengeti-P-heteropogon-contortus.png" },
	// { value: "lycaon_picturus",			text: "Serengeti-C-wild-dog.png" },
	// { value: "madoqua_kirkii",			text: "Serengeti-H-kirk-dik-dik.png" },
	// { value: "panthera_leo",			text: "Serengeti-C-lion.png" },
	// { value: "allophylus_rubifolius",	text: "Allophylus Rubifolius.png" },
	// { value: "placeholder_plant",		text: "PlaceHolder-Plant.png" },

	// { value: "leopard_seal",	text: "sea-C-leopard-seal.png" },
	// { value: "orca",			text: "sea-C-orca.png" },
	// { value: "krill",			text: "sea-H-krill.png" },
	// { value: "plankton",		text: "sea-H-Plankton.png" },

	// Animals
	{ value: "ACIJUB",	text: "ACIJUB.png" },
	{ value: "AEPMEL",	text: "AEPMEL.png" },
	{ value: "ALCBUS",	text: "ALCBUS.png" },
	{ value: "CANAUR",	text: "CANAUR.png" },
	{ value: "CANMES",	text: "CANMES.png" },
	{ value: "CARCAR",	text: "CARCAR.png" },
	{ value: "CONTAU",	text: "CONTAU.png" },
	{ value: "CROCRO",	text: "CROCRO.png" },
	{ value: "DAMKOR",	text: "DAMKOR.png" },
	{ value: "EQUBUR",	text: "EQUBUR.png" },
	{ value: "GAZGRA",	text: "GAZGRA.png" },
	{ value: "GAZTHO",	text: "GAZTHO.png" },
	{ value: "GIRCAM",	text: "GIRCAM.png" },
	{ value: "HETBRU",	text: "HETBRU.png" },
	{ value: "HIPAMP",	text: "HIPAMP.png" },
	{ value: "KOBELL",	text: "KOBELL.png" },
	{ value: "LEPSER",	text: "LEPSER.png" },
	{ value: "LOXAFR",	text: "LOXAFR.png" },
	{ value: "LYCPIC",	text: "LYCPIC.png" },
	{ value: "MADKIR",	text: "MADKIR.png" },
	{ value: "OUROUR",	text: "OUROUR.png" },
	{ value: "PANLEO",	text: "PANLEO.png" },
	{ value: "PANPAR",	text: "PANPAR.png" },
	{ value: "PAPANU",	text: "PAPANU.png" },
	{ value: "PEDCAP",	text: "PEDCAP.png" },
	{ value: "PHAAET",	text: "PHAAET.png" },
	{ value: "PROCAP",	text: "PROCAP.png" },
	{ value: "REDRED",	text: "REDRED.png" },
	{ value: "RHAPUM",	text: "RHAPUM.png" },
	{ value: "SYNCAF",	text: "SYNCAF.png" },
	{ value: "TAUORY",	text: "TAUORY.png" },
	{ value: "TRASCR",	text: "TRASCR.png" },

	// Plants
	{ value: "ACASEN",	text: "ACASEN.png" },
	{ value: "ACASEY",	text: "ACASEY.png" },
	{ value: "ACATOR",	text: "ACATOR.png" },
	{ value: "ACAXAN",	text: "ACAXAN.png" },
	{ value: "ACHASP",	text: "ACHASP.png" },
	{ value: "ALLRUB",	text: "ALLRUB.png" },
	{ value: "ALOMAC",	text: "ALOMAC.png" },
	{ value: "ALOSEC",	text: "ALOSEC.png" },
	{ value: "BALAEG",	text: "BALAEG.png" },
	{ value: "BLEACA",	text: "BLEACA.png" },
	{ value: "BOSAUG",	text: "BOSAUG.png" },
	{ value: "CAPTOM",	text: "CAPTOM.png" },
	{ value: "CHLGAY",	text: "CHLGAY.png" },
	{ value: "CISQUA",	text: "CISQUA.png" },
	{ value: "CISROT",	text: "CISROT.png" },
	{ value: "COMMEAFR",text: "COMMEAFR.png" },
	{ value: "COMMOL",	text: "COMMOL.png" },
	{ value: "CROMAC",	text: "CROMAC.png" },
	{ value: "CYNDAC",	text: "CYNDAC.png" },
	{ value: "EMICOC",	text: "EMICOC.png" },
	{ value: "ERACIL",	text: "ERACIL.png" },
	{ value: "EUPCAN",	text: "EUPCAN.png" },
	{ value: "EUSPAS",	text: "EUSPAS.png" },
	{ value: "FICTHI",	text: "FICTHI.png" },
	{ value: "GREBIC",	text: "GREBIC.png" },
	{ value: "HELSTE",	text: "HELSTE.png" },
	{ value: "HETCON",	text: "HETCON.png" },
	{ value: "HIB",		text: "HIB.png" },
	{ value: "HOSOPP",	text: "HOSOPP.png" },
	{ value: "HYPFOR",	text: "HYPFOR.png" },
	{ value: "INDHOC",	text: "INDHOC.png" },
	{ value: "IPOOBS",	text: "IPOOBS.png" },
	{ value: "KIGAFR",	text: "KIGAFR.png" },
	{ value: "MAETRI",	text: "MAETRI.png" },
	{ value: "OLE",		text: "OLE.png" },
	{ value: "PANCOL",	text: "PANCOL.png" },
	{ value: "PANMAX",	text: "PANMAX.png" },
	{ value: "PANREP",	text: "PANREP.png" },
	{ value: "PAPCAP",	text: "PAPCAP.png" },
	{ value: "PELCAL",	text: "PELCAL.png" },
	{ value: "PHRMAU",	text: "PHRMAU.png" },
	{ value: "FICGLU",	text: "FICGLU.png" },
	{ value: "RHOREV",	text: "RHOREV.png" },
	{ value: "SCLBIR",	text: "SCLBIR.png" },
	{ value: "SENDID",	text: "SENDID.png" },
	{ value: "SENEHR",	text: "SENEHR.png" },
	{ value: "SENSUF",	text: "SENSUF.png" },
	{ value: "SETSPH",	text: "SETSPH.png" },
	{ value: "SID",		text: "SID.png" },
	{ value: "SOLINC",	text: "SOLINC.png" },
	{ value: "SOLNIG",	text: "SOLNIG.png" },
	{ value: "SPOPYR",	text: "SPOPYR.png" },
	{ value: "THETRI",	text: "THETRI.png" },
	{ value: "TYPCAP",	text: "TYPCAP.png" },
	{ value: "XIMCAF",	text: "XIMCAF.png" },
	{ value: "ZIZ",		text: "ZIZ.png" },

	{ value: "placeholder_plant",	text: "PlaceHolder-Plant.png" },
	{ value: "icon-annualFlower",	text: "PlaceHolder-Plant.png" },
	{ value: "icon-grass",			text: "PlaceHolder-Plant.png" },
	{ value: "icon-herb",			text: "PlaceHolder-Plant.png" },
	{ value: "icon-shrub",			text: "PlaceHolder-Plant.png" },
	{ value: "icon-tree",			text: "PlaceHolder-Plant.png" },
];

const ANIMAL_FOODS = [
	{ value: "carnivore",	text: "Carnivore",		swedish: "Köttätare" },
	{ value: "omnivore",	text: "Omnivore",		swedish: "Allätare" },
	{ value: "herbivore",	text: "Herbivore",		swedish: "Växtätare" },
	{ value: "detritivore",	text: "Detritivore",	swedish: "Nedbrytare" },
];

const ANIMAL_SIZES = [
	{ value: "insignificant",	text: "Insignificant (<0,05 kg)" },
	{ value: "tiny",			text: "Tiny (>0,05 kg)" },
	{ value: "small",			text: "Small (>0,5 kg)" },
	{ value: "medium",			text: "Medium (>5 kg)" },
	{ value: "large",			text: "Large (>40 kg)" },
	{ value: "huge",			text: "Huge (>500 kg)" },
	{ value: "megafauna",		text: "Megafauna (>1 000 kg)" },
	{ value: "gigantic",		text: "Gigantic (>5 000 kg)" },
];

const SERVICE_CATEGORIES = [
	{ value: "support",		text: "Support" },
	{ value: "provision",	text: "Provision" },
	{ value: "regulation",	text: "Regulation" },
	{ value: "culture",		text: "Culture" },
];

const RELATION_INTERACTIONS = [
	{ value: "mutualism",		text: "(+,+) Mutualism" },
	{ value: "commensalism",	text: "(+,o) Commensalism" },
	{ value: "predation",		text: "(+,−) Predation" },
	{ value: "herbivory",		text: "(+,−) Herbivory" },
	{ value: "parasitism",		text: "(+,−) Parasitism" },
	{ value: "amensalism",		text: "(o,−) Amensalism" },
	{ value: "competition",		text: "(−,−) Competition" },
	{ value: "neutralism",		text: "(o,o) Neutralism" },
];

const ACTOR_VISIBILITY = [
	{ value: "explored",	text: "■ Explored" },
	{ value: "explorable",	text: "● Explorable" },
	{ value: "unexplored",	text: "○ Unexplored" },
	{ value: "hidden",		text: "Hidden" },
];

const ACTION_TYPES = [
	{ value: "player",		text: "Purchasable" },
	{ value: "automatic",	text: "Automatic" },
];

const EFFECT_METHODS = [
	{ value: "relative",	text: "Relative" },
	{ value: "target",		text: "Target" },
	{ value: "percentage",	text: "Percentage" },
];

const STAGE_LAYERS = [
	{ value: 0,		text: "Ground" },
	{ value: 1,		text: "Herb (1m)" },
	{ value: 5,		text: "Shrub (5m)" },
	{ value: 10,	text: "Understory (10m)" },
	{ value: 30,	text: "Canopy (30m)" },
];

const STAGE_SHADES = [
	{ value: 0.25,	text: "Partial (25%)" },
	{ value: 0.50,	text: "Dappled (50%)" },
	{ value: 0.75,	text: "Full (75%)" },
];


const NODE_TYPES_VALUES = NODE_TYPES.map((x) => {return x.value;});
const NODE_IMAGES_VALUES = NODE_IMAGES.map((x) => {return x.value;});
const ANIMAL_FOODS_VALUES = ANIMAL_FOODS.map((x) => {return x.value;});
const ANIMAL_SIZES_VALUES = ANIMAL_SIZES.map((x) => {return x.value;});
const SERVICE_CATEGORIES_VALUES = SERVICE_CATEGORIES.map((x) => {return x.value;});


function getFromDataset(dataset, input, output, value) {
	for (const data of dataset) {
		if (value == data[input]) {
			return data[output];
		}
	}
}

function getTextFromValue(dataset, value) {
	return getFromDataset(dataset, "value", "text", value);
}

function getValueFromText(dataset, text) {
	return getFromDataset(dataset, "text", "value", text);
}

function isAbiotic(value) {
	const type = getFromDataset(NODE_TYPES, "value", "type", value);
	return (type == "abiotic");
}