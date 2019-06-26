class Event {
	constructor(name, callback) {
		this.name = name;
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