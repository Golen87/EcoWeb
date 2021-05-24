const languageData = {

	"English": {
		"null": "",

		"title": "Serengeti Food Web",
		"next_button": "Next",

		"instruction_0": "Press a species to see its food web",
		"instruction_1": "Build a food chain by placing the plants and animals",
		"instruction_2": "Now, expand the food chain with more species to build a food web",
		"instruction_3": "Ut id cupidatat sunt exercitation reprehenderit duis aliquip dolor aliquip labore.",
		"instruction_4": "Try to remove the plants and animals to see how they influence each other",

		"explanation_1a": "You have created a food chain!",
		"explanation_1b": "The energy flows from the plant to the herbivore to the carnivore",
		"explanation_2a": "You have created a food web!",
		"explanation_2b": "Animals prefer some food over other, which makes more energy flow that way",

		"warning_1": "Animals cannot survive\nwithout anything to eat!",

		"node_carnivore": "Carnivore",
		"node_herbivore": "Herbivore",
		"node_plant": "Plant",

		"chapter_1": "Food Web",
		"chapter_2": "Eco Challenge",
		"chapter_3": "Eco Mission",
		"chapter_4": "Eco Web",

		"slider_groups": "Layout:  Groups",
		"slider_links": "Links",

		"graph_population": "Population size",
		"graph_jan": "Jan",
		"graph_feb": "Feb",
		"graph_mar": "Mar",
		"graph_apr": "Apr",
		"graph_may": "May",
		"graph_jun": "Jun",
		"graph_jul": "Jul",
		"graph_aug": "Aug",
		"graph_sep": "Sep",
		"graph_oct": "Oct",
		"graph_nov": "Nov",
		"graph_dec": "Dec",

		"iucn_status": "Conservation status:",
		"iucn_EX":	"Extinct",
		"iucn_EW":	"Extinct in the wild",
		"iucn_CR":	"Critically endangered",
		"iucn_EN":	"Endangered",
		"iucn_VU":	"Vulnerable",
		"iucn_NT":	"Near threatened",
		"iucn_LC":	"Least concern",
		"iucn_DD":	"Data deficient",
		"iucn_NE":	"Not evaluated",
	},

	"Swedish": {
		"null": "",

		"title": "Serengeti näringsväv",
		"next_button": "Gå vidare",

		"instruction_0": "Tryck på en art för att se dess näringsväv",
		"instruction_1": "Bygg en näringskedja genom att placera plantor och djur",
		"instruction_2": "Lägg till fler arter i näringskedjan för att bygga en näringsväv",
		"instruction_3": "Ut id cupidatat sunt exercitation reprehenderit duis aliquip dolor aliquip labore.",
		"instruction_4": "Prova att bort plantor och djur för att see hur de påverkar varandra",

		"explanation_1a": "Du har byggt en näringskedja!",
		"explanation_1b": "Energi flödar från plantor till växtätare och sedan till köttätare",
		"explanation_2a": "Du har byggt en näringsväv!",
		"explanation_2b": "Djuren föredrar ibland viss mat över annan, vilket får mer energi att flöda mellan dem",

		"warning_1": "Djuren kan inte överleva\nutan någonting att äta!",

		"node_carnivore": "Köttätare",
		"node_herbivore": "Växtätare",
		"node_plant": "Växt",

		"chapter_1": "Näringskedjor",
		"chapter_2": "Utmaningen",
		"chapter_3": "Uppdraget",
		"chapter_4": "Ekosystemet",

		"slider_groups": "Layout:  Grupper",
		"slider_links": "Relationer",

		"graph_population": "Populationsstorlek",
		"graph_jan": "jan",
		"graph_feb": "feb",
		"graph_mar": "mar",
		"graph_apr": "apr",
		"graph_may": "maj",
		"graph_jun": "jun",
		"graph_jul": "jul",
		"graph_aug": "aug",
		"graph_sep": "sep",
		"graph_oct": "okt",
		"graph_nov": "nov",
		"graph_dec": "dec",

		"iucn_status": "Bevarandestatus:",
		"iucn_EX":	"Utdöd",
		"iucn_EW":	"Utdöd i vilt tillstånd",
		"iucn_CR":	"Akut hotad",
		"iucn_EN":	"Starkt hotad",
		"iucn_VU":	"Sårbar",
		"iucn_NT":	"Nära hotad",
		"iucn_LC":	"Livskraftig",
		"iucn_DD":	"Kunskapsbrist",
		"iucn_NE":	"Ej bedömd",
	}

};


class LanguageManager {
	constructor() {
		this.languageList = ["English", "Swedish"];
		this.currentLanguage = "English";
		this.uniqueId = 1;
		this.boundObjects = {};

		this.checkLanguageData();
	}

	getNextId() {
		return this.uniqueId++;
	}

	// Check that all language keys are shared
	checkLanguageData() {
		let keyMap = {};
		for (let language of this.languageList) {
			for (let key in languageData[language]) {
				keyMap[key] = 1 + (keyMap[key] || 0);
			}
		}
		for (let key in keyMap) {
			if (keyMap[key] != 2) {
				console.error("Phrase not found in all languages: '{0}'".format(key));
			}
		}
	}

	initNodeNames(nodes) {
		for (const node of nodes) {
			languageData.English[node.id] = node.eng || node.name;
			languageData.Swedish[node.id] = node.swe || node.name;
			// languageData.Chinese[node.id] = node.chi || node.name;
		}
	}


	// Change language
	setLanguage(language) {
		console.assert(this.languageList.includes(language) && languageData[language], "Language not available.");
		if (this.currentLanguage != language) {
			this.currentLanguage = language;
			this.updateAllObjects();
		}
	}

	// Return key-mapped phrase of current selected language
	get(key) {
		let text = languageData[this.currentLanguage][key];
		console.assert(text != null, "Phrase not found in {0}: '{1}'".format(this.currentLanguage, key));
		return text;
	}

	// Bind a text-object to a phrase with automatic updates upon language change
	bind(object, key, callback=null) {
		// Remove old instance (usually when phrase is changed)
		this.unbind(object);

		// Check that object is text with Phaser's setText function
		console.assert(typeof object.setText === 'function', "Object does not support 'setText' and cannot be bound.");

		object.bindId = this.getNextId();
		this.boundObjects[object.bindId] = { object, key, callback, previous: null };

		this.updateObject(object);
	}

	// Remove object from list of automatic text updates
	unbind(object) {
		if (object && object.bindId) {
			object.bindId = null;
			delete this.boundObjects[object.bindId];
		}
	}

	updateAllObjects() {
		for (let blob of Object.values(this.boundObjects)) {
			this.updateObject(blob.object);
		}
	}

	updateObject(object) {
		if (object.bindId) {
			let blob = this.boundObjects[object.bindId];

			// Check that the text remains the same.
			let phraseCheck = (blob.previous == null || blob.previous == "" || blob.previous == object.text);
			console.assert(phraseCheck, "Phrase has changed since last bind. '{0}': '{1}' != '{2}'".format(blob.key, blob.previous, object.text));
	
			let newText = this.get(blob.key);
			object.setText(newText);
			blob.previous = newText;

			if (blob.callback) {
				blob.callback();
			}
		}
	}
}