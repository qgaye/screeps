import { CreepRole } from "@/constants/global"

interface CreepConfig {
  count: number
  body: BodyPartConstant[]
}

export const CreepConfigs: { [role in CreepRole]: CreepConfig } = {
  [CreepRole.Harvest]: { count: 5, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.Builder]: { count: 2, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.Upgrader]: { count: 1, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.Repairer]: { count: 2, body: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] },
  [CreepRole.FixedWorker]: { count: 0, body: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY] },
  [CreepRole.FixedUpgrader]: { count: 0, body: [WORK, WORK, WORK, WORK, CARRY, CARRY] },
}
