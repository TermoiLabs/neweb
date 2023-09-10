import { RollupBabelInputPluginOptions, babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript, { RollupTypescriptOptions } from "@rollup/plugin-typescript";
import type { Plugin, RollupOptions } from "rollup";

interface Parameters {
	newConfig?: {
		root?: RollupOptions;
		plugins?: {
			typescript?: RollupTypescriptOptions;
			babel?: RollupBabelInputPluginOptions;
			extra?: Plugin[];
		};
	};
}

function mergeDefaultRollupConfig({ newConfig }: Parameters = {}) {
	let plugins = [
		typescript({
			include: ["src/**/*", "rollup.config.ts"],
			...newConfig?.plugins?.typescript,
		}),
		babel({
			babelHelpers: "bundled",
			extensions: [".js", ".cjs", ".mjs", ".jsx", ".ts", ".cts", ".mts", ".tsx"],
			...newConfig?.plugins?.babel,
		}),
		terser(),
	];

	plugins = plugins.concat(newConfig?.plugins?.extra || []);

	const root = structuredClone(newConfig?.root);

	const config: RollupOptions = {
		input: "src/index.ts",
		output: {
			dir: "dist",
			format: "esm",
			sourcemap: true,
		},
		plugins,
		...root,
	};

	return config;
}

export default mergeDefaultRollupConfig;
