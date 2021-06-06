interface CreepMemory {
  role: CreepRole
  builder?: BuilderCreepMemory
  upgrader?: UpgraderCreepMemory
}

interface BuilderCreepMemory {
  isBuilding: boolean
}

interface UpgraderCreepMemory {
  isUpgrading: boolean
}

declare enum CreepRole {
  Harvest = "harvest",
  Builder = "builder",
  Upgrader = "upgrader",
}
