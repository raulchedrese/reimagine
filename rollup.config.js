import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.tsx",
    output: {
      format: "umd",
      name: "index",
      file: "index.js"
    },
    plugins: [typescript()]
  },
  {
    input: "src/demo.tsx",
    output: {
      format: "umd",
      name: "main",
      file: "docs/main.js",
      sourcemap: true
    },
    plugins: [typescript()]
  }
];
