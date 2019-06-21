// Based on https://github.com/rollup/rollup-starter-lib

import autoExternal from "rollup-plugin-auto-external"
import commonJs from "rollup-plugin-commonjs"
import json from "rollup-plugin-json"
import { string } from "rollup-plugin-string"

import pkg from "./package.json"

const stringConfig = { include: `./src/templates/**/*.hbs` }

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs" }, //
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      autoExternal(), //
      json(),
      string(stringConfig),
      commonJs()
    ]
  }
]
