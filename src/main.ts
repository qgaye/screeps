import { ErrorMapper } from "./utils/ErrorMapper"

export const loop = ErrorMapper.wrapLoop(() => console.log("hello screeps"))
