"_$_NEWEB_WEBPACK_MAGIC_DIRECTIVE_$_";
// This directive is how the webpack plugin will find this file.
// If you change it the test will break

import getModuleDir from "@dist/node/getModuleDir.js";
import { readFileSync } from "fs";

// This weird function is necessary in order to prove in the integration test that
// getConfig will still return the same value even when it doesn't have access to
// node APIs like readFileSync (that's why we can't just import neweb.config.js)
function getConfig() {
	let config = readFileSync(
		`${getModuleDir(import.meta.url)}/neweb.config.js`,
		"utf-8",
		"_$_TEST_FUNC_MARKER_$_"
	)
		.match(/'\{.+\}'/)[0]
		.split("");
	config.shift();
	config.pop();
	config = config.join("");

	globalThis.neweb = JSON.parse(config);
	return JSON.parse(config);
}

export default getConfig;
