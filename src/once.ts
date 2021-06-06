import _ from "lodash"
import { CreepRole } from "@/constants/global"

export const initMemoryVar = (): void => {
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName]
    room.memory.roleCount = {}
    for (const role in CreepRole) {
      room.memory.roleCount = { [role as CreepRole]: countCreep(room, role as CreepRole), ...room.memory.roleCount }
    }
    console.log(`[Room] '${roomName}': roleCount: ${JSON.stringify(room.memory.roleCount)}`)
  }
}

const countCreep = (room: Room, role: CreepRole): number =>
  _.filter(Game.creeps, (creep) => creep.room.name === room.name && creep.memory.role === role).length
