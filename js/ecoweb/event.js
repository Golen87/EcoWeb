class Event {
	constructor(name, icon, desc, callback) {
		this.name = name;
		this.icon = icon;
		this.desc = desc;
		this.callback = callback;

		this.enabled = true;
	}
}

class ActiveEvent {
	constructor(time, event) {
		this.time = time;
		this.event = event;
	}
}