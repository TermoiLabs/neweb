import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * Get a module's directory when using ES modules. This is meant to be used with import.meta.url, but can
 * also be used with any file:/// URI
 */
function getModuleDir(fileUri: string) {
	return dirname(fileURLToPath(fileUri));
}

export default getModuleDir;
