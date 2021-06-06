import { CreepRole, Spawn1 } from "@/constants/global"
import { genCreep, getExistCreepsCount } from "."

interface CreepConfig {
  count: number
  body: BodyPartConstant[]
}

const CreepConfigs: { [role in CreepRole]: CreepConfig } = {
  [CreepRole.Harvest]: { count: 5, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.Builder]: { count: 2, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.Upgrader]: { count: 1, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.Repairer]: { count: 1, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
}

export const autoMaintainCreeps = (): void => {
  autoRemoveCreeps()
  Object.keys(Game.rooms).forEach(autoCreateCreeps)
}

const autoCreateCreeps = (roomName: string) => {
  Object.values(CreepRole).forEach((role) => {
    if (getExistCreepsCount(roomName, role) < CreepConfigs[role].count) {
      genCreep(Spawn1, role, CreepConfigs[role].body)
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
