import { ErrorMapper } from "@/utils/ErrorMapper"
import { Spawn1 } from "@/constants/global"
import { initMemoryVar } from "@/once"

const run = () => {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log(`[Creep] delete non-existing '${name}' in memory`)
    }
  }
  if (Object.keys(Game.creeps).length <= 3) {
    Game.spawns[Spawn1].spawnCreep([WORK, CARRY, MOVE], `harvest-creep-${Game.time}`, { memory: { role: "harvest" } })
    Game.spawns[Spawn1].spawnCreep([WORK, CARRY, MOVE], `upgrader-creep-${Game.time}`, { memory: { role: "upgrader" } })
  }
  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (creep.memory.role === "harvest") {
      harvest(creep)
    } else if (creep.memory.role === "upgrader") {
      upgrade(creep)
    } else if (creep.memory.role === "builder") {
      build(creep)
    }
  }
}

const harvest = (creep: Creep) => {
  if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0])
    }
  } else {
    if (creep.transfer(Game.spawns[Spawn1], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns[Spawn1])
    }
  }
}

const upgrade = (creep: Creep) => {
  if (creep.store[RESOURCE_ENERGY] === 0) {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0])
    }
  } else {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller)
    }
  }
}

const build = (creep: Creep) => {
  const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
  if (target) {
    const code = creep.build(target)
    console.log(`[Build] build return code = ${code}`)
    if (code == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  }
}

initMemoryVar()

export const loop = ErrorMapper.wrapLoop(() => run())
