class BaseEvent {
	constructor(event, action) {
		this.id = event.id;
		this.name = event.name;
		this.description = event.description;
		this.image = event.image;
		this.duration = event.duration;
		this.owner_id = event.owner_id;

		this.type = action.type;
		this.cost = (this.type == "player") ? action.cost : null;
		this.autoTime = (this.type == "automatic") ? action.time : null;

		this.enabled = true;


		this.effects = [];

		for (const effect of event.effects) {
			for (const node of window.database.getAffectedNodes(effect)) {

				//const func = (effect.value / this.duration).toString() + " * t";
				const func = "t * t * (3 - 2*t)";

				this.effects.push({
					"node_id": node.id,
					"method": effect.method,
					"value": effect.value,
					"duration": this.duration,
					"derivative": math.derivative(func, "t").compile(),
				});
			}
		}
	}
}

class ActiveEvent {
	constructor(event, time) {
		this.event = event;
		this.startTime = time;
		this.endTime = time + event.duration;
		this.active = false;
	}

	setActive(value) {
		this.active = value;
	}
}