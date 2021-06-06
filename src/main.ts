import { ErrorMapper } from "@/utils/ErrorMapper"
import { CreepRole, Spawn1 } from "@/constants/global"
import { consoleRoomsStatus } from "@/once"
import { autoMaintainCreeps } from "./creeps/auto"

const run = () => {
  autoMaintainCreeps()
  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (creep.memory.role === CreepRole.Harvest) {
      harvest(creep)
    } else if (creep.memory.role === CreepRole.Upgrader) {
      upgrade(creep)
    } else if (creep.memory.role === CreepRole.Builder) {
      build(creep)
    }
  }
}

const harvest = (creep: Creep) => {
  if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
    const sources = creep.room.find(FIND_SOURCES)
    const sourcePos = parseInt(creep.name.charAt(creep.name.length - 1)) % 2
    if (creep.harvest(sources[sourcePos]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[sourcePos])
    }
  } else {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
          (structure.store.getFreeCapacity() ?? 0) > 0
        )
      },
    })
    if (targets.length == 0) {
      return
    }
    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns[Spawn1])
    }
  }
}

const upgrade = (creep: Creep) => {
  creep.memory.upgrader = creep.memory.upgrader || { isUpgrading: false }
  const upgraderVar = creep.memory.upgrader
  if (upgraderVar.isUpgrading && creep.store.energy === 0) {
    upgraderVar.isUpgrading = false
  }
  if (!upgraderVar.isUpgrading && creep.store.getFreeCapacity() <= 0) {
    upgraderVar.isUpgrading = true
  }
  if (upgraderVar.isUpgrading) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller)
    }
  } else {
    const source = creep.pos.findClosestByRange(FIND_SOURCES)
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
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
