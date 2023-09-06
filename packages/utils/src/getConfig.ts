"_$_NEWEB_WEBPACK_MAGIC_DIRECTIVE_$_";
// DO NOT TOUCH THE DIRECTIVE ABOVE OR THE WEBPACK PLUGIN WILL BREAK

import DataUriParser from "datauri/parser.js";
import { existsSync, lstatSync, readFileSync } from "fs";
import { extname, isAbsolute as isPathAbsolute } from "path";
import ts from "typescript";
import { findFileBottomUp } from ".";
import Logger from "./Logger";
import defaultNewebConfig from "./assets/defaultNewebConfig";
import getModuleDir from "./node/getModuleDir";
import rootDir from "./node/rootDir";
import { NewebConfig } from "./types/index";
import hybridImport from "./node/hybridImport";

const supportedFileNames = ["neweb.config.js", "neweb.config.ts", "neweb.config.json"] as const;
const logger = new Logger();

/** Identifies .ts, .cts, and .mts */
const isTypeScriptFile = (path: string) => [".ts", ".cts", ".mts"].includes(extname(path));
/**
 * Searches for a config file using Node.js APIs. If the environment is determined to be a browser,
 * returns the default configuration. This function should be compiled at build time to return the
 * configuration by using a bundler plugin. Alternatively, it can also be evaluated at runtime by using
 * the static `Configuration` class.
 *
 * @param path Use this when neweb can't find the correct config file
 * @param logging Disables logging. Mostly used to avoid a stack overflow with the Logger class
 */
async function getConfig(path?: string | null, logging = true): Promise<NewebConfig> {
	let configFile: Partial<NewebConfig> = {};

	/**
	 * The file we're on will be distributed as a JavaScript file, and because the following dynamic
	 * import import will happen at runtime and it might or might not be a TypeScript file, there's no
	 * way for TypeScript to compile the dynamic import into a JavaScript file at buildtime so we have to
	 * do it ourselves again at runtime (runtime still being in a Node.js environment).
	 */
	async function getTsConfig(configPath: string): Promise<{ default: NewebConfig } | null> {
		// This path has to be a variable otherwise Rollup will try and create a chunk at buildtime.
		// TypeScript will also complain
		const javascriptString = ts.transpileModule(readFileSync(configPath, "utf-8"), {
			compilerOptions: { module: ts.ModuleKind.ES2022 },
		});

		const dataUriJavascript = new DataUriParser().format(
			"neweb.config.js",
			javascriptString.outputText
		).content;

		if (typeof dataUriJavascript !== "string") return null;
		return await import(dataUriJavascript);
	}

	if (typeof path !== "string") {
		for (const fileName of supportedFileNames) {
			// Find config file starting from the root of the project, if it can't find it because there's no node_modules
			// (probably happens in Yarn PnP), attempt to use the directory of this file
			let configPath = findFileBottomUp(fileName, false, rootDir || getModuleDir(import.meta.url));

			if (typeof configPath === "string") {
				configFile =
					(isTypeScriptFile(configPath)
						? await getTsConfig(configPath)
						: await hybridImport(configPath)
					)?.default || {};
				if (Object.keys(configFile).length > 0) break;
			}
		}
	} else if (typeof path === "string") {
		// Initially the path must be an absolute path and not a file URI so we can check if it's absolute
		// If we were to accept file URIs they could be used with relative paths which would get resolved to the CWD
		if (isPathAbsolute(path)) {
			function findConfig() {
				if (existsSync(path as string) && lstatSync(path as string).isDirectory()) {
					for (const fileName of supportedFileNames) {
						const filePathResult = findFileBottomUp(fileName, false, path as string);
						if (typeof filePathResult === "string") return filePathResult;
					}
				} else {
					return path;
				}
				return null;
			}
			const configPath = findConfig();
			if (typeof configPath === "string") {
				try {
					configFile =
						(configPath.endsWith(".ts")
							? await getTsConfig(configPath)
							: await hybridImport(configPath)
						)?.default || {};
				} catch (err) {
					if (logging) {
						logger.warn(
							`Failed to load config file based on the following path explicitly given: ${configPath}`
						);
					}
				}
			}
		}
	}

	if (logging && Object.keys(configFile).length < 1) {
		logger.info("No configuration file resolved, using default values");
	}

	return {
		...defaultNewebConfig,
		...configFile,
	};
}

export default getConfig;
