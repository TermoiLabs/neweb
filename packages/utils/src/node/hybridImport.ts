import { readFileSync } from "fs";
import { extname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const isFileUri = (path: string) => path.startsWith("file:");

/**
 * This function can be used to import either JavaScript or JSON. Babel doesn't currently allow dynamic
 * imports of JSON modules so this reads the file and returns a synthetic import instead. **Only works
 * when the file ends in `.json`**.
 *
 * @param path Relative, file URI, or absolute path from either Windows or POSIX
 */
async function hybridImport(path: string) {
	return extname(path) === ".json"
		? {
				default: JSON.parse(readFileSync(isFileUri(path) ? fileURLToPath(path) : path, "utf-8")),
		  }
		: await import(isFileUri(path) ? path : pathToFileURL(path).href);
}

export default hybridImport;
