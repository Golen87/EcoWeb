const NODE_TYPES = [
	{ value: "animal",	text: "Consumer (animal)",		type: "biotic" },
	{ value: "plant",	text: "Producer (plant)",		type: "biotic" },
	{ value: "fungi",	text: "Decomposer (detrivore)",	type: "biotic" },
	{ value: "abiotic",	text: "Abiotic (non-living)",	type: "abiotic" },
	{ value: "service",	text: "Ecosystem services",		type: "abiotic" },
];

const NODE_IMAGES = [
	{ value: "missing",				text: "assets/images/icons/Missing.png" },
	{ value: "räv",					text: "assets/images/icons/Räv.png" },
	{ value: "lo",					text: "assets/images/icons/Lo.png" },
	{ value: "duvhök",				text: "assets/images/icons/Duvhök.png" },
	{ value: "kattuggla",			text: "assets/images/icons/Kattuggla.png" },
	{ value: "snok",				text: "assets/images/icons/Snok.png" },
	{ value: "dovhjort",			text: "assets/images/icons/Dovhjort.png" },
	{ value: "rådjur",				text: "assets/images/icons/Rådjur.png" },
	{ value: "hare",				text: "assets/images/icons/Hare.png" },
	{ value: "skogssorkgråsiding",	text: "assets/images/icons/Skogssork_Grasiding.png" },
	{ value: "norvacka",			text: "assets/images/icons/Norvacka.png" },
	{ value: "koltrast",			text: "assets/images/icons/Koltrast.png" },
	{ value: "vanliggroda",			text: "assets/images/icons/VanligGroda.png" },
	{ value: "daggmask",			text: "assets/images/icons/Daggmask.png" },
	{ value: "skalbagge",			text: "assets/images/icons/Skalbagge.png" },
	{ value: "trädlevandeinsekt",	text: "assets/images/icons/TrädlevandeInsekt.png" },
	{ value: "träd",				text: "assets/images/icons/Träd.png" },
	{ value: "gräs",				text: "assets/images/icons/Gräs.png" },
	{ value: "ört",					text: "assets/images/icons/Ört.png" },
	{ value: "blåbär",				text: "assets/images/icons/Blåbär.png" },
	{ value: "svamp",				text: "assets/images/icons/Svamp.png" },
	{ value: "detrius",				text: "assets/images/icons/Detrius.png" },
];

const ANIMAL_FOODS = [
	{ value: "carnivore",	text: "Carnivore" },
	{ value: "omnivore",	text: "Omnivore" },
	{ value: "herbivore",	text: "Herbivore" },
	{ value: "detritivore",	text: "Detritivore" },
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


function getTextFromValue(dataset, value) {
	for (const data of dataset) {
		if (value == data.value) {
			return data.text;
		}
	}
}

function getValueFromText(dataset, text) {
	for (const data of dataset) {
		if (text == data.text) {
			return data.value;
		}
	}
}

function isAbiotic(value) {
	for (const data of NODE_TYPES) {
		if (value == data.value) {
			return (data.type == "abiotic");
		}
	}
}