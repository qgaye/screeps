import { BuilderRole, HarvestRole, RoleName, RoomName, UpgraderRole } from "@/constants/global"

export const getCreepCountFromMemory = (roomName: RoomName, roleName: RoleName): number => {
  const room = Game.rooms[roomName]

  switch (roleName) {
    case HarvestRole:
      return room.memory.harvestCount
    case UpgraderRole:
      return room.memory.upgraderCount
    case BuilderRole:
      return room.memory.builderCount
    default:
      console.log(`[ERROR] getCreepCountFromMemory unknown roleName, roleName: ${roleName}`)
      return 0
  }
}
