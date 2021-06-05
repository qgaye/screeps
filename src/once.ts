import _ from "lodash"
import { BuilderRole, CreepRole, HarvestRole, UpgraderRole } from "./constants/global"

export const initMemoryVar = (): void => {
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName]
    room.memory.harvestCount = countCreep(roomName, HarvestRole)
    room.memory.upgraderCount = countCreep(roomName, UpgraderRole)
    room.memory.builderCount = countCreep(roomName, BuilderRole)
    console.log(
      `[Room] '${roomName}': harvestCount: ${room.memory.harvestCount}, upgraderCount: ${room.memory.upgraderCount}, builderCount: ${room.memory.builderCount}`
    )
  }
}

const countCreep = (roomName: string, roleName: CreepRole): number =>
  _.filter(Game.creeps, (o) => o.room.name === roomName && o.memory.role === roleName).length
