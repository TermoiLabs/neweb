import { mergeDefaultRollupConfig } from "./src/index";

export default mergeDefaultRollupConfig({
	newConfig: { plugins: { typescript: { tsconfig: "./tsconfig.json" } } },
});
