// This file is the entry point for the Webpack plugin and needs to call getConfig
// in order to include it in the compilation
import getConfig from "./getConfig.js";

(async () => {
	globalThis.neweb = await getConfig();
})();
