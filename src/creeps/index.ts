import _ from "lodash"
import { CreepRole } from "@/constants/global"

export const genCreep = (spawn: string, role: CreepRole, body: BodyPartConstant[]): boolean => {
  if (Game.spawns[spawn].spawning) {
    return false
  }
  const name = `${role}-${Game.time}`
  const code = Game.spawns[spawn].spawnCreep(body, name, { memory: { role: role } })
  console.log(`[Creep] generate '${name}' ${OK === code ? "success" : "failed"}, err code = ${code}`)
  return OK === code
}

export const getExistCreeps = (roomName: string, role: CreepRole): Creep[] => {
  return _.filter(
    Game.creeps,
    (creep) => creep.room.name === roomName && creep.memory.role != undefined && creep.memory.role === role
  )
}

export const getExistCreepsCount = (roomName: string, role: CreepRole): number => {
  return getExistCreeps(roomName, role).length
}
