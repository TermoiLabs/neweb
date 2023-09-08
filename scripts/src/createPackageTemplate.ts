import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmdirSync, writeFileSync } from "fs";
import { findFileBottomUp } from "neweb-local-utils/node";
import { join as joinPath } from "path";
import { stdin as input, stdout as output } from "process";
import { createInterface as createReadlineInterface } from "readline/promises";
import { PackageJson, TsConfigJson } from "type-fest";

const defaultPackageJson: PackageJson = {
	name: "",
	description: "",
	version: "0.1.0",
	author: "Lorenzo Bloedow",
	license: "MIT",
	keywords: ["neweb"],
	main: "dist/index.js",
	types: "dist/types/src/index.d.ts",
	type: "module",
	files: ["dist", "package.json"],
	scripts: {
		build: "rimraf dist && rollup --config rollup.config.ts --configPlugin @rollup/plugin-typescript",
		postbuild: "rimraf dist/types/rollup.config.d.ts && rimraf dist/types/rollup.config.d.ts.map",
		dev: "rollup --config rollup.config.ts --configPlugin @rollup/plugin-typescript --watch",
	},
	devDependencies: {
		rimraf: "^5.0.1",
		rollup: "^3.28.1",
		"dev-utils": "workspace:^0.1.0",
	},
	dependencies: {
		tslib: "^2.6.2",
	},
};

const defaultTsConfig: TsConfigJson = {
	extends: "../../tsconfig.json",
	compilerOptions: {
		declarationDir: "dist/types",
	},
	exclude: ["dist"],
};

const defaultRollupConfig: { [key: string]: any } = {
	newConfig: { plugins: { typescript: { tsconfig: "./tsconfig.json" } } },
};

const defaultGitIgnore = `
dist
node_modules
`;

(async () => {
	const manifestPath = findFileBottomUp("package.json", false);

	if (typeof manifestPath !== "string") {
		throw new Error("Could not find a package.json file from " + process.cwd());
	}
	console.info("package.json file found at " + manifestPath);

	const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

	// Check if the manifest found is the root manifest
	if (manifest.name !== "neweb") {
		throw new Error(
			"package.json found doesn't seem to be the root manifest file for neweb, " +
				"try calling this script from a higher directory"
		);
	}

	// Ask for package name by listening to STDIN
	const rl = createReadlineInterface({ input, output });
	const packageName = await rl.question("What will be the name of the package?\n");

	const yesRegex = /y(es)?/i;

	const multiEnv = yesRegex.test(
		await rl.question("Will your package support multiple environments? (Y/N)\n")
	);

	// Determine environments
	let environments: string[] = [];
	if (multiEnv) {
		environments = (
			await rl.question(
				"What are the environments? The first will be the default (hybrid,browser,node)"
			)
		).split(/,\s*/);
		environments = environments.filter((env) => env !== "");

		if (environments.length === 0) {
			environments = ["hybrid", "browser", "node"];
		}
	}

	// Multi-env package.json
	if (multiEnv) {
		delete defaultPackageJson.main;
		delete defaultPackageJson.types;

		const getEnvExport = (env: string) => ({
			types: `./dist/types/src/${env}/index.d.ts`,
			default: `./dist/${env}/index.js`,
		});

		defaultPackageJson.exports = {
			".": getEnvExport(environments[0]),
		};
		const partialEnvironments = environments.slice(1);

		for (const env of partialEnvironments) {
			defaultPackageJson.exports[`./${env}`] = getEnvExport(env);
		}
	}

	// Multi-env rollup config
	if (multiEnv) {
		defaultRollupConfig.newConfig.root = {
			input: environments.map((env) => `./src/${env}/index.ts`),
			output: {
				dir: "dist",
				format: "esm",
				sourcemap: true,
				preserveModules: true,
			},
		};
	}

	const defaultRollupConfigString = `
import { mergeDefaultRollupConfig } from "dev-utils";

export default mergeDefaultRollupConfig(${JSON.stringify(defaultRollupConfig)});
`;

	const packageDir = joinPath(manifestPath, "..", "packages", packageName);

	if (existsSync(packageDir)) {
		if (readdirSync(packageDir).length > 0) {
			throw new Error("Package with the same name found at " + packageDir);
		}
		rmdirSync(packageDir);
	}

	defaultPackageJson.name = packageName;

	mkdirSync(packageDir);
	mkdirSync(joinPath(packageDir, "dist"));
	mkdirSync(joinPath(packageDir, "src"));
	mkdirSync(joinPath(packageDir, "test"));

	writeFileSync(joinPath(packageDir, "package.json"), JSON.stringify(defaultPackageJson));
	writeFileSync(joinPath(packageDir, "tsconfig.json"), JSON.stringify(defaultTsConfig));
	writeFileSync(joinPath(packageDir, "rollup.config.ts"), defaultRollupConfigString.trim());
	writeFileSync(joinPath(packageDir, ".gitignore"), defaultGitIgnore.trim());

	if (!multiEnv) {
		writeFileSync(joinPath(packageDir, "src", "index.ts"), "");
	} else {
		for (const env of environments) {
			mkdirSync(joinPath(packageDir, "src", env));
			writeFileSync(joinPath(packageDir, "src", env, "index.ts"), "", {});
		}
	}

	execSync(
		`cd ${packageDir} && pnpm i && npx prettier ./* ./**/* --write --cache --cache-strategy content --ignore-unknown`
	);
	console.log(`Package template for ${packageName} successfully created!`);

	rl.close();
})();
