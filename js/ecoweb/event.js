class Event {
	constructor(name, desc, callback) {
		this.name = name;
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