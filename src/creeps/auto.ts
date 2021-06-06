import { CreepRole, Spawn1 } from "@/constants/global"
import { genCreep, getExistCreepsCount } from "."

interface CreepConfig {
  count: number
  body: BodyPartConstant[]
}

const CreepConfigs: { [role in CreepRole]: CreepConfig } = {
  [CreepRole.Harvest]: { count: 3, body: [WORK, CARRY, MOVE] },
  [CreepRole.Builder]: { count: 5, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.Upgrader]: { count: 2, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
}

export const autoMaintainCreeps = (): void => {
  autoRemoveCreeps()
  Object.keys(Game.rooms).forEach(autoCreateCreeps)
}

const autoCreateCreeps = (roomName: string) => {
  Object.values(CreepRole).forEach((role) => {
    for (let i = getExistCreepsCount(roomName, role); i < CreepConfigs[role].count; i++) {
      const isSuc = genCreep(Spawn1, role, CreepConfigs[role].body)
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
