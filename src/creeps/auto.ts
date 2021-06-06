import * as global from "@/constants/global"
import { getCreepCountInMemory, setCreepCountInMemeory } from "@/memory/creep"
import { genCreep, getExistCreepsCount } from "."

const FixedCreepCount = {
  [global.CreepRole.Harvest]: 5,
  [global.CreepRole.Builder]: 2,
  [global.CreepRole.Upgrader]: 2,
}

export const autoMaintainCreeps = (): void => {
  autoRemoveCreeps()
  Object.keys(Game.rooms).forEach(autoCreateCreeps)
}

const autoCreateCreeps = (roomName: string) => {
  Object.values(global.CreepRole).forEach((role) => {
    for (let i = getExistCreepsCount(roomName, role); i < FixedCreepCount[role]; i++) {
      const isSuc = genCreep(global.Spawn1, role, [WORK, CARRY, MOVE])
      if (!isSuc) {
        break
      }
    }
  })
}

const autoRemoveCreeps = () => {
  Object.keys(Memory.creeps)
    .filter((name) => !Game.creeps[name])
    .forEach((name) => {
      delete Memory.creeps[name]
      console.log(`[Creep] delete non-existing '${name}' in memory`)
    })
}
