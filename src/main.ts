import { ErrorMapper } from "@/utils/ErrorMapper"
import { CreepRole } from "@/constants/global"
import { consoleRoomsStatus } from "@/once"
import { autoMaintainCreeps, autoPosRoad } from "@/creeps/auto"
import _ from "lodash"

const run = () => {
  autoMaintainCreeps()
  Object.keys(Game.spawns).forEach(autoPosRoad)
  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (creep.memory.role === CreepRole.Harvest) {
      harvest(creep)
    } else if (creep.memory.role === CreepRole.Upgrader) {
      upgrade(creep)
    } else if (creep.memory.role === CreepRole.Builder) {
      build(creep)
    } else if (creep.memory.role === CreepRole.Repairer) {
      repair(creep)
    }
  }
}

const harvest = (creep: Creep) => {
  creep.memory.harvest = creep.memory.harvest || { isTransfering: false }
  if (creep.memory.harvest.isTransfering && creep.store.energy === 0) {
    creep.memory.harvest.isTransfering = false
  }
  if (!creep.memory.harvest.isTransfering && creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
    creep.memory.harvest.isTransfering = true
  }
  if (creep.memory.harvest.isTransfering) {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_CONTAINER) &&
          (structure.store.getFreeCapacity(RESOURCE_ENERGY) ?? 0) > 0
        )
      },
    })
    if (targets.length == 0) {
      return
    }
    const nonContainerTargets = _.filter(targets, (target) => target.structureType !== STRUCTURE_CONTAINER)
    const target = nonContainerTargets.length > 0 ? nonContainerTargets[0] : targets[0]
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES)
    // TODO 取模以判断去哪个source
    const sourcePos = parseInt(creep.name.charAt(creep.name.length - 1)) % 2
    if (creep.harvest(sources[sourcePos]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[sourcePos])
    }
  }
}

const upgrade = (creep: Creep) => {
  creep.memory.upgrader = creep.memory.upgrader || { isUpgrading: false }
  const upgraderVar = creep.memory.upgrader
  if (upgraderVar.isUpgrading && creep.store.energy === 0) {
    upgraderVar.isUpgrading = false
  }
  if (!upgraderVar.isUpgrading && creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
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
    getEnergy(creep)
  }
}

const repair = (creep: Creep) => {
  creep.memory.repairer = creep.memory.repairer || { isRepairing: false }
  if (creep.memory.repairer.isRepairing && creep.store.energy === 0) {
    creep.memory.repairer.isRepairing = false
  }
  if (!creep.memory.repairer.isRepairing && creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
    creep.memory.repairer.isRepairing = true
  }
  if (creep.memory.repairer.isRepairing) {
    // TODO 暂时先修不修墙
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType !== STRUCTURE_WALL && structure.hits < structure.hitsMax,
    })
    // .sort((a, b) => a.hits - b.hits)

    if (targets.length > 0) {
      if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0])
      }
    }
  } else {
    const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store.energy > 0,
    })
    if (target) {
      if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    } else {
      const source = creep.pos.findClosestByRange(FIND_SOURCES)
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    }
  }
}

const fixedUpgrade = (creep: Creep) => {
  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    getEnergyFromContainer(creep)
  }
  const code = creep.upgradeController(creep.room.controller)
  if (code !== OK) {
    console.log(`[FixedUpgrader] failed to upgrade controller, err code = ${code}`)
  }
}

const getEnergyFromContainer = (creep: Creep): boolean => {
  const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store.energy > 0,
  })
  if (target) {
    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  }
  return target !== null
}

const getEnergyFromSource = (creep: Creep) => {
  const source = creep.pos.findClosestByRange(FIND_SOURCES)
  if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
    creep.moveTo(source)
  }
}

const getEnergy = (creep: Creep) => {
  if (!getEnergyFromContainer(creep)) {
    getEnergyFromSource(creep)
  }
}

consoleRoomsStatus()

export const loop = ErrorMapper.wrapLoop(() => run())
