import preserveDirectives from "rollup-plugin-preserve-directives";
import { mergeDefaultRollupConfig } from "@termoi/neweb-dev-utils";

export default mergeDefaultRollupConfig({
	newConfig: {
		plugins: { typescript: { tsconfig: "./tsconfig.json" }, extra: [preserveDirectives()] },
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
