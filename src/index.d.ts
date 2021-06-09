interface CreepMemory {
  role: CreepRole
  harvest?: HarvestCreepMemory
  builder?: BuilderCreepMemory
  upgrader?: UpgraderCreepMemory
  repairer?: RepairerCreepMemory
}

declare enum CreepRole {
  Harvest = "harvest",
  Builder = "builder",
  Upgrader = "upgrader",
  Repairer = "repairer",
  FixedWorker = "fixedWorker",
  FixedUpgrader = "fixedUpgrader",
}

interface SpawnMemory {
  isPosAllSources: boolean
}

interface BuilderCreepMemory {
  isBuilding: boolean
}

interface UpgraderCreepMemory {
  isUpgrading: boolean
}

interface HarvestCreepMemory {
  isTransfering: boolean
}

interface RepairerCreepMemory {
  isRepairing: boolean
}
