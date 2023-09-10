import { RollupBabelInputPluginOptions, babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import ts, { TypescriptPluginOptions } from "rollup-plugin-ts";
import type { Plugin, RollupOptions } from "rollup";

interface Parameters {
	newConfig?: {
		root?: RollupOptions;
		plugins?: {
			typescript?: Partial<TypescriptPluginOptions>;
			babel?: RollupBabelInputPluginOptions;
			extra?: Plugin[];
		};
	};
}

function mergeDefaultRollupConfig({ newConfig }: Parameters = {}) {
	let plugins = [
		// browserslist is not working in this plugin as of v3.4.5
		ts({ browserslist: false, ...newConfig?.plugins?.typescript }),
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
