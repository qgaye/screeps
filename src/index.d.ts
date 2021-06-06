interface CreepMemory {
  role: string
}

interface RoomMemory {
  roleCount: { [role in CreepRole]?: number }
}

declare enum CreepRole {
  Harvest = "harvest",
  Builder = "builder",
  Upgrader = "upgrader",
}
