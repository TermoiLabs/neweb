import { existsSync, lstatSync } from "fs";
import { dirname, join as joinPath, sep } from "path";

type FinalResult<S extends boolean | undefined> = S extends true ? string[] | null : string | null;
type AbsolutePath = string;

function findFileBottomUp<S extends boolean | undefined>(
	fileName: string,
	findAll?: S,
	startingPath?: AbsolutePath
): FinalResult<S> {
	let currentDirSections = process.cwd().split(sep);
	if (typeof startingPath === "string") {
		currentDirSections = (
			lstatSync(startingPath).isFile() ? dirname(startingPath) : startingPath
		).split(sep);
	}

	const pathsFound = [];
	for (let i = 0; i < currentDirSections.length; i++) {
		const currentPath = joinPath(currentDirSections.join(sep), fileName);
		if (existsSync(currentPath)) {
			if (!findAll) {
				return currentPath as FinalResult<S>;
			}
			pathsFound.push(currentPath);
		}
		currentDirSections.pop();
	}

	if (pathsFound.length > 0) {
		return pathsFound as FinalResult<S>;
	}

	return null;
}

export default findFileBottomUp;
