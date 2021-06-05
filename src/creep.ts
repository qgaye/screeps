import { CreepRole, SpawnName } from "./constants/global"

export const genCreep = (spawn: SpawnName, role: CreepRole, body: BodyPartConstant[]): void => {
  const name = `${role}-${Game.time}`
  const code = Game.spawns[spawn].spawnCreep(body, name, { memory: { role: role } })
  if (OK === code) {
    console.log(`[Creep] generate '${name}' success`)
  } else {
    console.log(`[Creep] generate '${name}' failed, err code = ${code}`)
  }
}
