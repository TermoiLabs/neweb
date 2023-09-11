import { TsConfigJson } from "type-fest";
import recursiveReadDir from "recursive-readdir";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join as joinPath, resolve as resolvePath, relative as relativePath } from "path";

const cwd = process.cwd();
const args = process.argv.slice(2);

const tsConfigPath = joinPath(cwd, typeof args[0] === "string" ? args[0] : "./tsconfig.json");
const tsConfigDir = dirname(tsConfigPath);

(async () => {
	const tsconfig: TsConfigJson = (await import(tsConfigPath, { assert: { type: "json" } })).default;

	if (typeof tsconfig.compilerOptions?.outDir !== "string") {
		throw new Error("Missing compilerOptions.outDir");
	}
	// @ts-ignore
	const files = await recursiveReadDir(joinPath(tsConfigDir, tsconfig.compilerOptions.outDir), [
		(file) => file.endsWith(".map"),
	]);

	const aliases = tsconfig.compilerOptions?.paths;
	for (let i = 0; i < files.length; i++) {
		const filePath = files[i];
		const file = readFileSync(filePath, "utf-8");

		for (const alias in aliases) {
			const aliasPath = aliases[alias][0];
			const formattedAlias = aliasPath.endsWith("*") ? aliasPath.slice(0, -1) : aliasPath;
			const absAliasPath = resolvePath(tsConfigDir, formattedAlias);
			const relativeAliasPath = relativePath(dirname(filePath), absAliasPath);

			const newFile = file.replaceAll(new RegExp(alias, "g"), `${relativeAliasPath}/`);
			writeFileSync(filePath, newFile);
		}
	}
})();
