const { World, PrototypeRegistry, Component, Entities } = require("./dist");

const world = new World()

class PlayerComponent { }
class PositionComponent {
	x = 0; y = 0 ;
	get position() { return { x: this.x, y: this.y }}
}
Component("PlayerComponent")(PlayerComponent)
Component("PositionComponent")(PositionComponent)


// Creating entities from components
const entity = world.createEntity(
	new PlayerComponent(),
	new PositionComponent()
)
console.log({entity})

for (const [entity, position, player] of world.query(Entities, PositionComponent, PlayerComponent)) {
	console.log({entity, position, player});
}
console.log("after query");

const prototypes = new PrototypeRegistry();

prototypes.registerComponent("PlayerComponent", PlayerComponent)
prototypes.registerComponent("PositionComponent", PositionComponent)
prototypes.registerPrototype("Player", 
	{ typeId: "PlayerComponent", props: {} },
	{ typeId: "PositionComponent", props: { x: 10, y: 5 } },
)
/*
const parser = new XmlPrototypeParser();
prototypes.registerPrototype(
	parser.parse(`
		<Entity id="Dummy">
			<PlayerComponent />
			<PositionComponent x="2" y="4! />
		</Entity>
	`)
)
*/
world.injectDependency(prototypes)
prototypes.world = world
const player = prototypes.createEntity("Player")
console.log(player)
// console.log(prototypes.createEntity("Dummy"))


class DeltaTime { dt = 0 }
const deltaTime = new DeltaTime()

world.injectDependency(deltaTime)

// function type system
world.addSystem((world) => {
	const time = world.getDependency(DeltaTime)
	console.log("Elapsed time:", time.dt)

	world.listen("onUpdate", (context) => {
		console.log("Elapsed time:", time.dt)
		console.log(world.query(PlayerComponent))

		for (const players of world.query(PlayerComponent)) {
			console.log("function type")
		}
	})
})

// class type system
class PlayerUpdateSystem {
	/** @type {World} */
	world

	/** @param {World} world */
	setup(world) {
		world.listen("onUpdate", this.onUpdate.bind(this))
	}

	onUpdate() {
		const entities = this.world.query(PlayerComponent, PositionComponent)
		for (const [_, position] of entities) {
			console.log("Class type: ", position.position)
			position.parent
		}
	}
}
world.addSystem(new PlayerUpdateSystem())

deltaTime.dt += 1;

world.emit("onUpdate")