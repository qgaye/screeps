interface CreepMemory {
  role: CreepRole
  harvest?: HarvestCreepMemory
  builder?: BuilderCreepMemory
  upgrader?: UpgraderCreepMemory
  repairer?: RepairerCreepMemory
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

declare enum CreepRole {
  Harvest = "harvest",
  Builder = "builder",
  Upgrader = "upgrader",
  Repairer = "repairer",
}
