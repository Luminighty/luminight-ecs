import { EntityId } from "../entity"
import { World } from "../world/world"

type SystemSetupFunction = (world: World) => void
export interface ISystem { setup(world: World): void }

export type System = SystemSetupFunction | ISystem

export type EventContext = {
	entity?: EntityId,
	[key: string]: any
}

export type EventHandler = (context: EventContext) => void
