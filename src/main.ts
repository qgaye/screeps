import { ErrorMapper } from "@/utils/ErrorMapper"
import { Spawn1, CreepRole } from "@/constants/global"
import { consoleRoomsStatus, initMemoryVar } from "@/once"
import { autoMaintainCreeps } from "./creeps/auto"

const run = () => {
  autoMaintainCreeps()
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
  creep.memory.builder = creep.memory.builder || { isBuilding: false }
  const builderVar = creep.memory.builder
  if (builderVar.isBuilding && creep.store.energy === 0) {
    builderVar.isBuilding = false
  }
  if (!builderVar.isBuilding && creep.store.energy === creep.store.getCapacity()) {
    builderVar.isBuilding = true
  }
  if (builderVar.isBuilding) {
    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
    if (target) {
      const code = creep.build(target)
      if (code === ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    }
  } else {
    const source = creep.pos.findClosestByRange(FIND_SOURCES)
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    }
  }
}

consoleRoomsStatus()

export const loop = ErrorMapper.wrapLoop(() => run())
