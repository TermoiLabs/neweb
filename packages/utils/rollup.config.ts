import { mergeDefaultRollupConfig } from "@termoi/neweb-dev-utils";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default mergeDefaultRollupConfig({
	newConfig: {
		plugins: { typescript: { tsconfig: "./tsconfig.json" }, extra: [preserveDirectives()] },
		root: {
			input: [
				"./src/hybrid/index.ts",
				"./src/browser/index.ts",
				"./src/node/index.ts",
				"./src/node/webpack/configLoader.ts",
				"./src/types/index.ts",
			],
			output: {
				dir: "dist",
				format: "esm",
				sourcemap: true,
				preserveModules: true,
			},
		},
	},
});
