import clear from "rollup-plugin-clear"
import screeps from "rollup-plugin-screeps"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"

const REMOTE = "remote"

/* eslint-disable */
let config = process.env.PUSH && process.env.PUSH === "true" ? require("./.screeps.json")[REMOTE] : null

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true,
  },
  external: ["lodash"],
  plugins: [
    clear({ targets: ["dist"] }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    screeps({ config, dryRun: !config }),
  ],
}
