import type { Compiler, WebpackPluginInstance } from "webpack";
import getConfig from "../../hybrid/getConfig";
import { WebpackPluginUserConfig } from "../../types";
import { readFileSync } from "fs";
import { resolve as resolvePath } from "path";
import getModuleDir from "../getModuleDir";

async function compileConfigFile(
	compiler: Compiler,
	packageName: string,
	config: WebpackPluginUserConfig | undefined
) {
	const resolvedConfig = await getConfig(config?.configPath);
	compiler.hooks.compilation.tap(packageName, (compilation) => {
		compiler.webpack.NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(
			packageName,
			(loaders, normalModule) => {
				const userRequest = normalModule.userRequest;
				const startIndex =
					userRequest.lastIndexOf("!") === -1 ? 0 : userRequest.lastIndexOf("!") + 1;

				const modulePath = userRequest.substring(startIndex).split("?")[0];
				if (modulePath) {
					const moduleContent = readFileSync(modulePath, "utf-8");
					if (moduleContent.startsWith("'_$_NEWEB_WEBPACK_MAGIC_DIRECTIVE_$_'")) {
						(loaders as NormalModuleLoader[]).push({
							loader: resolvePath(getModuleDir(import.meta.url), "configLoader.js"),
							options: {
								resolvedConfig,
							},
							type: "module",
						});
					}
				}
			}
		);
	});
}

type NormalModuleLoader = {
	loader: string;
	options: any;
	ident?: string;
	type?: string;
};

/**
 * @classdesc Base class for the Webpack plugin.
 * Should never be used on its own.
 */
class NewebWebpackPlugin implements WebpackPluginInstance {
	#pluginName = "neweb-webpack-plugin";
	#packageName;
	userConfig?: WebpackPluginUserConfig;

	constructor(packageName: `@neweb/${string}`, userConfig?: WebpackPluginUserConfig) {
		this.#packageName = packageName;
		this.userConfig = userConfig;
	}

	apply: WebpackPluginInstance["apply"] = function apply(this: NewebWebpackPlugin, compiler) {
		compiler.hooks.beforeRun.tapAsync(this.#pluginName, async (compiler, callback) => {
			await compileConfigFile(compiler, this.#packageName, this.userConfig);
			callback();
		});

		compiler.hooks.watchRun.tapAsync(this.#pluginName, async (compiler, callback) => {
			await compileConfigFile(compiler, this.#packageName, this.userConfig);
			callback();
		});
	};
}

export default NewebWebpackPlugin;
