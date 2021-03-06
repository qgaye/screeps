import { CreepConfigs } from "@/config"
import { CreepRole, Spawn1 } from "@/constants/global"
import { genCreep, getExistCreepsCount } from "."

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

export const autoPosRoad = (spawnName: string): void => {
  const spawn = Game.spawns[spawnName]
  if (spawn.memory.isPosAllSources) {
    return
  }
  const sources = spawn.room.find(FIND_SOURCES)
  sources.forEach((source) => {
    const path = Game.spawns[spawnName].pos.findPathTo(source, { ignoreCreeps: true })
    path.pop()
    path.forEach((p) => {
      spawn.room.createConstructionSite(p.x, p.y, STRUCTURE_ROAD)
    })
  })
  spawn.memory.isPosAllSources = true
}
