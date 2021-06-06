interface CreepMemory {
  role: CreepRole
  builder?: BuilderCreepMemory
}

interface BuilderCreepMemory {
  isBuilding: boolean
}

interface RoomMemory {
  roleCount: { [role in CreepRole]?: number }
}

declare enum CreepRole {
  Harvest = "harvest",
  Builder = "builder",
  Upgrader = "upgrader",
}
