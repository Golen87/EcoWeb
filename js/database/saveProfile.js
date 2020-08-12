const PROFILE_VERSION = 1;

class SaveProfile {
	constructor() {
		this.levels = {};
		this.nodes = {};

		this.load();
	}


	/* Data management */

	reset() {
		this.levels = {};
		this.nodes = {};
		this.save();
	}

	load() {
		let localdata = localStorage.getItem("profile");
		if (localdata) {
			this.importJSON(localdata);
		}

		this.save();
	}

	save() {
		localStorage.setItem("profile", this.exportJSON());
	}

	importJSON(json) {
		let data = JSON.parse(json);

		if (data && isPlainObject(data) && data.version == PROFILE_VERSION) {
			this.levels = data.levels;
			this.nodes = data.nodes;
		}
	}

	exportJSON() {
		let data = {
			"version": PROFILE_VERSION,
			"levels": this.levels,
			"nodes": this.nodes,
		};
		return JSON.stringify(data, null);
	}

	isBlank() {
		return this.getTotalStars() == 0 && this.getTotalExplored() == 0;
	}


	/* Level management */

	addLevel(scenario) {
		this.levels[scenario.id] = {
			unlocked: false,
			stars: 0
		};
	}

	getLevel(scenario) {
		if (!this.levels[scenario.id]) {
			this.addLevel(scenario);
		}
		return this.levels[scenario.id];
	}

	isUnlocked(scenario) {
		return this.getTotalStars() >= scenario.stars;
	}

	completeLevel(scenario, stars) {
		let level = this.getLevel(scenario);
		level.stars = Math.max(level.stars, stars);
		this.save();
	}

	getTotalStars() {
		let count = 0;
		for (let id in this.levels) {
			count += this.levels[id].stars;
		}
		return count;
	}

	getStarsFor(scenario) {
		return this.getLevel(scenario).stars;
	}


	/* Bestiary */

	addNode(species) {
		this.nodes[species.id] = {
			explored: false
		};
	}

	getNode(species) {
		if (!this.nodes[species.id]) {
			this.addNode(species);
		}
		return this.nodes[species.id];
	}

	exploreNode(species) {
		let node = this.getNode(species);
		node.explored = true;
		this.save();
	}

	isExplored(species) {
		return this.getNode(species).explored;
	}

	getTotalExplored() {
		let count = 0;
		for (let id in this.nodes) {
			if (this.nodes[id].explored) {
				count += 1;
			}
		}
		return count;
	}
}

window.profile = new SaveProfile();