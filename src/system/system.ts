import { Entity } from "../entity"
import { World } from "../world/world"

type SystemSetupFunction = (world: World) => void
export interface ISystem { setup(world: World): void }

export type System = SystemSetupFunction | ISystem

export type EventContext = {
	entity?: Entity,
	world?: World,
}


export type EventHandler = (context: EventContext) => void
