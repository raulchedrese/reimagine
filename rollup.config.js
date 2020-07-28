import typescript from "rollup-plugin-typescript2";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.tsx",
    output: {
      format: "umd",
      name: "index",
      file: "lib/index.js",
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.tsx",
    output: {
      format: "esm",
      name: "index",
      file: "es/index.js",
    },
    plugins: [typescript()],
  },
  {
    input: "src/demo.tsx",
    output: {
      format: "umd",
      name: "main",
      file: "docs/main.js",
      sourcemap: true,
    },
    plugins: [typescript()],
  },
];
