export const getCreepCountInMemory = (roomName: string, role: CreepRole): number => {
  const room = Game.rooms[roomName]
  return room.memory.roleCount[role] ?? 0
}

export const setCreepCountInMemeory = (roomName: string, role: CreepRole, count: number): void => {
  const room = Game.rooms[roomName]
  room.memory.roleCount = room.memory.roleCount ?? {}
  room.memory.roleCount = { [role]: count, ...room.memory.roleCount }
}
