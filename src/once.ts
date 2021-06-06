import _ from "lodash"
import { CreepRole } from "@/constants/global"
import { setCreepCountInMemeory } from "./memory/creep"
import { getExistCreepsCount } from "./creeps"

// export const initMemoryVar = (): void => {
//   for (const roomName in Game.rooms) {
//     const room = Game.rooms[roomName]
//     Object.values(CreepRole).forEach((role) => setCreepCountInMemeory(room.name, role, countCreep(room, role)))
//     console.log(`[Room] '${roomName}': roleCount: ${JSON.stringify(room.memory.roleCount)}`)
//   }
// }

const countCreep = (room: Room, role: CreepRole): number =>
  _.filter(Game.creeps, (creep) => creep.room.name === room.name && creep.memory.role === role).length

interface RoomStatus {
  roleCount: { [role in CreepRole]?: number }
}

const consoleRoomStatus = (roomName: string) => {
  const status: RoomStatus = { roleCount: {} }
  Object.values(CreepRole).forEach(
    (role) => (status.roleCount = { [role]: getExistCreepsCount(roomName, role), ...status.roleCount })
  )
  console.log(`[Room] '${roomName}' status: ${JSON.stringify(status)}`)
}

export const consoleRoomsStatus = (): void => {
  Object.keys(Game.rooms).forEach((roomName) => consoleRoomStatus(roomName))
}
