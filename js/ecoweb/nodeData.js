const NODE_TYPES = [
	{ value: "animal",	text: "Animal" },
	{ value: "plant",	text: "Plant" },
	{ value: "fungi",	text: "Fungi" },
	{ value: "abiotic",	text: "Abiotic" },
];

const NODE_IMAGES = [
	{ value: "missing",				path: "assets/images/icons/Missing.png" },
	{ value: "räv",					path: "assets/images/icons/Räv.png" },
	{ value: "lo",					path: "assets/images/icons/Lo.png" },
	{ value: "duvhök",				path: "assets/images/icons/Duvhök.png" },
	{ value: "kattuggla",			path: "assets/images/icons/Kattuggla.png" },
	{ value: "snok",				path: "assets/images/icons/Snok.png" },
	{ value: "dovhjort",			path: "assets/images/icons/Dovhjort.png" },
	{ value: "rådjur",				path: "assets/images/icons/Rådjur.png" },
	{ value: "hare",				path: "assets/images/icons/Hare.png" },
	{ value: "norvacka",			path: "assets/images/icons/Norvacka.png" },
	{ value: "koltrast",			path: "assets/images/icons/Koltrast.png" },
	{ value: "vanliggroda",			path: "assets/images/icons/VanligGroda.png" },
	{ value: "daggmask",			path: "assets/images/icons/Daggmask.png" },
	{ value: "skalbagge",			path: "assets/images/icons/Skalbagge.png" },
	{ value: "trädlevandeinsekt",	path: "assets/images/icons/TrädlevandeInsekt.png" },
	{ value: "träd",				path: "assets/images/icons/Träd.png" },
	{ value: "gräs",				path: "assets/images/icons/Gräs.png" },
	{ value: "ört",					path: "assets/images/icons/Ört.png" },
	{ value: "blåbär",				path: "assets/images/icons/Blåbär.png" },
	{ value: "svamp",				path: "assets/images/icons/Svamp.png" },
	{ value: "detrius",				path: "assets/images/icons/Detrius.png" },
];

const ANIMAL_FOODS = [
	{ value: "carnivore",	text: "Carnivore" },
	{ value: "omnivore",	text: "Omnivore" },
	{ value: "herbivore",	text: "Herbivore" },
	{ value: "detritivore",	text: "Detritivore" },
];

const ANIMAL_SIZES = [
	{ value: "tiny",	text: "Tiny (insect)" },
	{ value: "small",	text: "Small (rodent)" },
	{ value: "medium",	text: "Medium (dog)" },
	{ value: "large",	text: "Large (horse)" },
	{ value: "huge",	text: "Huge (elephant)" },
];

const ABIOTIC_TYPES = [
	{ value: "support",		text: "Supporting services" },
	{ value: "provision",	text: "Provisioning services" },
	{ value: "regulation",	text: "Regulating services" },
	{ value: "culture",		text: "Cultural services" },
	{ value: "harmful",		text: "I'm in this picture and I don't like it" },
];

const RELATION_TYPES = [
	{ value: "node",		text: "Node" },
	{ value: "category",	text: "Category" },
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


const NODE_TYPES_VALUES = NODE_TYPES.map((x) => {return x.value;});
const NODE_IMAGES_VALUES = NODE_IMAGES.map((x) => {return x.value;});
const ANIMAL_FOODS_VALUES = ANIMAL_FOODS.map((x) => {return x.value;});
const ANIMAL_SIZES_VALUES = ANIMAL_SIZES.map((x) => {return x.value;});
const ABIOTIC_TYPES_VALUES = ABIOTIC_TYPES.map((x) => {return x.value;});
const RELATION_TYPES_VALUES = RELATION_TYPES.map((x) => {return x.value;});
const RELATION_INTERACTIONS_VALUES = RELATION_INTERACTIONS.map((x) => {return x.value;});
