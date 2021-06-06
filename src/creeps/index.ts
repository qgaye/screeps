import _ from "lodash"
import { Room1, RoomName, Spawn1, SpawnName } from "@/constants/global"

export const genCreep = (spawn: SpawnName, role: CreepRole, body: BodyPartConstant[]): void => {
  const name = `${role}-${Game.time}`
  const code = Game.spawns[spawn].spawnCreep(body, name, { memory: { role: role } })
  if (OK === code) {
    console.log(`[Creep] generate '${name}' success`)
  } else {
    console.log(`[Creep] generate '${name}' failed, err code = ${code}`)
  }
}

export const getExistCreeps = (role: CreepRole): Creep[] => {
  return _.filter(Game.creeps, (creep) => creep.memory.role != undefined && creep.memory.role === role)
}

export const getExistCreepCount = (role: CreepRole): number => {
  return getExistCreeps(role).length
}
