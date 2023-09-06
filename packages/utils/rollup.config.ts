import { mergeDefaultRollupConfig } from "dev-utils";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default mergeDefaultRollupConfig({
	newConfig: {
		plugins: { typescript: { tsconfig: "./tsconfig.json" }, extra: [preserveDirectives()] },
		root: {
			output: {
				dir: "dist",
				format: "esm",
				sourcemap: true,
				preserveModules: true,
			},
		},
	},
});
