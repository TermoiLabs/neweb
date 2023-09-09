import { mergeDefaultRollupConfig } from "dev-utils";

export default mergeDefaultRollupConfig({
	newConfig: {
		plugins: { typescript: { tsconfig: "./tsconfig.json" } },
		root: {
			input: ["src/browser/index.ts", "src/hybrid/index.ts", "src/node/index.ts"],
			output: {
				dir: "dist",
				format: "esm",
				sourcemap: true,
				preserveModules: true,
			},
		},
	},
});
