const NODE_TYPES = [
	{ value: "animal",	text: "Consumer (animal)",		type: "biotic",		swedish: "Konsument" },
	{ value: "plant",	text: "Producer (plant)",		type: "biotic",		swedish: "Producent" },
	{ value: "fungi",	text: "Decomposer (detrivore)",	type: "biotic",		swedish: "Nedbrytare" },
	{ value: "abiotic",	text: "Abiotic (non-living)",	type: "abiotic",	swedish: "Abiotisk" },
	{ value: "service",	text: "Ecosystem services",		type: "abiotic",	swedish: "Ekosystemtjänst" },
];

const NODE_IMAGES_PATH = "assets/images/nodes/original/";
const NODE_IMAGES_PATH_SMALL = "assets/images/nodes/128/";
const NODE_IMAGES = [
	{ value: "missing",				text: "Missing.png" },
	{ value: "blåbär",				text: "Blåbär.png" },
	{ value: "daggmask",			text: "Daggmask.png" },
	{ value: "detrius",				text: "Detrius.png" },
	{ value: "dovhjort",			text: "Dovhjort.png" },
	{ value: "duvhök",				text: "Duvhök.png" },
	{ value: "fiskebåt",			text: "FiskeBåt.png" },
	{ value: "gräs",				text: "Gräs.png" },
	{ value: "hare",				text: "Hare.png" },
	{ value: "hasselnöt",			text: "Hasselnöt.png" },
	{ value: "havsfåglar",			text: "HavsFåglar.png" },
	{ value: "havsfisk",			text: "HavsFisk.png" },
	{ value: "havsutter",			text: "Havsutter.png" },
	{ value: "jättekelp",			text: "Jättekelp.png" },
	{ value: "kattuggla",			text: "Kattuggla.png" },
	{ value: "kelpfisk",			text: "KelpFisk.png" },
	{ value: "kelp",				text: "Kelp.png" },
	{ value: "koltrast",			text: "Koltrast.png" },
	{ value: "lax",					text: "Lax.png" },
	{ value: "lo",					text: "Lo.png" },
	{ value: "mussla",				text: "Mussla.png" },
	{ value: "norvacka",			text: "Norvacka.png" },
	{ value: "ormstjärna",			text: "Ormstjärna.png" },
	{ value: "öronsäl",				text: "Öronsäl.png" },
	{ value: "ört",					text: "Ört.png" },
	{ value: "pirål",				text: "Pirål.png" },
	{ value: "plankton",			text: "Plankton.png" },
	{ value: "rådjur",				text: "Rådjur.png" },
	{ value: "rankforing",			text: "Rankforing.png" },
	{ value: "räv",					text: "Räv.png" },
	{ value: "säl",					text: "Säl.png" },
	{ value: "säl_sjöelefant",		text: "Säl_Sjöelefant.png" },
	{ value: "sjöborre",			text: "Sjöborre.png" },
	{ value: "sjölejon_california",	text: "Sjölejon_California.png" },
	{ value: "skalbagge",			text: "Skalbagge.png" },
	{ value: "skogssork_grasiding",	text: "Skogssork_Grasiding.png" },
	{ value: "snok",				text: "Snok.png" },
	{ value: "späckhuggare",		text: "Späckhuggare.png" },
	{ value: "svamp",				text: "Svamp.png" },
	{ value: "trädlevandeinsekt",	text: "TrädlevandeInsekt.png" },
	{ value: "träd",				text: "Träd.png" },
	{ value: "utterjägare",			text: "UtterJägare.png" },
	{ value: "utter",				text: "Utter.png" },
	{ value: "valar",				text: "Valar.png" },
	{ value: "vanliggroda",			text: "VanligGroda.png" },
	{ value: "vithövdadhavsörn",	text: "VithövdadHavsörn.png" },
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
	{ value: "explored",	text: "Explored" },
	{ value: "unexplored",	text: "Unexplored" },
	{ value: "hidden",		text: "Hidden" },
];

const ACTION_TYPES = [
	{ value: "player",		text: "Purchasable" },
	{ value: "automatic",	text: "Automatic" },
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