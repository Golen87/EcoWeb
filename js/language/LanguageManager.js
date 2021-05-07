const languageData = {

	"English": {
		"title": "Serengeti Food Web",
		"next_button": "Next",

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
	},

	"Swedish": {
		"title": "Serengeti näringsväv",
		"next_button": "Gå vidare",

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
		"node_plant": "Planta",

		"chapter_1": "Näringskedjor",
		"chapter_2": "Eko-utmaningen",
		"chapter_3": "Eko-uppdraget",
		"chapter_4": "Eko-väven",

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

	setLanguage(language) {
		console.assert(this.languageList.includes(language), "Language not available.");
		console.assert(languageData[language], "Language not available.");
		this.currentLanguage = language;
		this.updateAllObjects();
	}

	get(key) {
		let text = languageData[this.currentLanguage][key];
		console.assert(text != null, "Phrase not found in {0}: '{1}'".format(this.currentLanguage, key));
		return text;
	}

	bind(object, key) {
		// Remove old instance (usually when phrase is changed)
		this.unbind(object);

		// Check that object is text with Phaser's setText function
		console.assert(typeof object.setText === 'function', "Object does not support 'setText' and cannot be bound.");

		object.languageKey = key;
		object.languageId = this.getNextId();
		this.boundObjects[object.languageId] = object;

		this.updateObject(object);
	}

	unbind(object) {
		if (object && object.languageId) {
			delete this.boundObjects[object.languageId];
		}
	}

	updateAllObjects() {
		for (let object of Object.values(this.boundObjects)) {
			this.updateObject(object);
		}
	}

	updateObject(object) {
		if (object.languageKey) {
			// Check that the text remains the same.
			let prev = object.languagePrevious;
			console.assert(prev == null || object.text == prev, "Phrase has changed since last bind. New text is not translated.");

			let newText = this.get(object.languageKey);
			object.setText(newText);
			object.languagePrevious = newText;
		}
	}
}