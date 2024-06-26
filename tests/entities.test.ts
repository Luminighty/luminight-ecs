import { World, Component } from "../src"
import { EntityId } from "../src/entity";

@Component("Player")
class Player { }

@Component("Position")
class Position { x = 0; y = 0 }

@Component("Foo")
class Foo { }


test("creating entity", () => {
	const world = new World()

	const playerComponent = new Player()
	const positionComponent = new Position()

	const player = world.createEntity(playerComponent, positionComponent)
	expect(world.getComponent(player, Player)).toBe(playerComponent)
	expect(world.getComponent(player, Position)).toBe(positionComponent)

})


test("creating multiple entities", () => {
	const world = new World()

	const playerComponent = new Player()
	const positionComponent = new Position()
	const otherPositionComponent = new Position()
	otherPositionComponent.x = 5
	otherPositionComponent.y = 10

	const player = world.createEntity(playerComponent, positionComponent)
	const other = world.createEntity(otherPositionComponent)

	expect(world.getComponent(player, Position)).toBe(positionComponent)
	expect(world.getComponent(other, Position)).toBe(otherPositionComponent)
})


test("same component reference", () => {
	const world = new World()

	const position = new Position()
	const player = world.createEntity(position)

	const change = world.getComponent(player, Position)
	change.x = 2
	change.y = 3

	expect(position.x).toBe(2)
	expect(position.y).toBe(3)
})


test("deleting entity", () => {
	const world = new World()

	@Component("Foo")
	class Foo {}
	
	const player = world.createEntity(new Position(), new Player())
	world.createEntity(new Position, new Player())
	world.createEntity(new Position())
	world.createEntity(new Foo())

	expect(world.entities.length()).toBe(4)
	expect(world.query(Player)).toHaveLength(2)
	expect(world.query(Position)).toHaveLength(3)
	expect(world.query(Foo)).toHaveLength(1)

	world.deleteEntity(player)
	world.maintain()

	expect(world.entities.length()).toBe(3)
	expect(world.query(Player)).toHaveLength(1)
	expect(world.query(Position)).toHaveLength(2)
	expect(world.query(Foo)).toHaveLength(1)
})


test("One component per type", () => {
	const world = new World()

	const position = new Position()
	const other = new Position()

	const player = world.createEntity()

	expect(world.addComponent(player, position)).toBe(position)
	expect(world.addComponent(player, other)).toBe(position)
})


test("deleting entity complex", () => {
	const world = new World();
	
	const positions = [
		new Position(),
		new Position(),
		new Position(),
		new Position(),
		new Position(),
	]
	const deletePosition = new Position()
	const playerComponent = new Player()
	const player = world.createEntity(
		playerComponent,
		positions[0]
	)
	const others: Array<EntityId> = []
	others[1] = world.createEntity(
		new Foo(),
		positions[1]
	)
	const toDelete = world.createEntity(
		new Foo(),
		deletePosition
	)
	for (let i = 2; i < positions.length; i++) {
		others[i] = world.createEntity(
			new Foo(),
			positions[i]
		)
	}

	world.deleteEntity(toDelete)
	expect(world.components.toDelete["Position"].has(deletePosition)).toBe(true)
	for (const position of positions) {
		expect(world.components.toDelete["Position"].has(position)).toBe(false)
	}
	world.maintain()
	expect(world.entities.get(player).components["Position"]).toBe(positions[0])
	expect(world.entities.get(player).components["Player"]).toBe(playerComponent)

	expect(world.entities.get(others[1]).components["Position"]).toBe(positions[1])
	expect(world.entities.get(others[2]).components["Position"]).toBe(positions[2])
	expect(world.entities.get(others[3]).components["Position"]).toBe(positions[3])
	expect(world.entities.get(others[4]).components["Position"]).toBe(positions[4])
	
})