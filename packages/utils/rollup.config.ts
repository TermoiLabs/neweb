import { mergeDefaultRollupConfig } from "dev-utils";

export default mergeDefaultRollupConfig({
	newConfig: {
		plugins: { typescript: { tsconfig: "./tsconfig.json" } },
	},
});
